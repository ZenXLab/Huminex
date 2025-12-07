// ATLAS Service Worker with Advanced Caching
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `atlas-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `atlas-dynamic-${CACHE_VERSION}`;
const API_CACHE = `atlas-api-${CACHE_VERSION}`;
const ADMIN_CACHE = `atlas-admin-${CACHE_VERSION}`;

// Assets to pre-cache on install
const STATIC_ASSETS = [
  '/',
  '/favicon.png',
  '/manifest.json'
];

// Cache duration settings (in seconds)
const CACHE_DURATIONS = {
  static: 7 * 24 * 60 * 60,    // 7 days for static assets
  api: 5 * 60,                  // 5 minutes for API responses
  admin: 24 * 60 * 60,          // 24 hours for admin chunks
};

// Install event - pre-cache essential assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing ATLAS Service Worker');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Pre-cache failed for some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating ATLAS Service Worker');
  const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, ADMIN_CACHE];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Determine caching strategy based on request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // API requests to Supabase
  if (url.hostname.includes('supabase') || url.pathname.startsWith('/rest/')) {
    return 'stale-while-revalidate';
  }
  
  // Admin module chunks (lazy-loaded components)
  if (url.pathname.includes('/assets/') && url.pathname.includes('Admin')) {
    return 'cache-first';
  }
  
  // Static assets (JS, CSS, images, fonts)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    return 'cache-first';
  }
  
  // HTML pages - network first
  if (request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    return 'network-first';
  }
  
  // Default to network first
  return 'network-first';
}

// Cache First Strategy - for static assets
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[SW] Cache first fetch failed:', error);
    throw error;
  }
}

// Network First Strategy - for HTML pages
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy - for API requests
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      // Add timestamp for cache expiration
      const headers = new Headers(response.headers);
      headers.set('sw-cached-at', Date.now().toString());
      
      const responseWithTimestamp = new Response(response.clone().body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
      
      cache.put(request, responseWithTimestamp);
    }
    return response;
  }).catch(() => cached);
  
  // Return cached response immediately if available
  if (cached) {
    // Check if cache is still valid
    const cachedAt = cached.headers.get('sw-cached-at');
    if (cachedAt) {
      const age = (Date.now() - parseInt(cachedAt)) / 1000;
      if (age < CACHE_DURATIONS.api) {
        // Still valid, return cached and update in background
        fetchPromise.catch(() => {});
        return cached;
      }
    }
  }
  
  return fetchPromise;
}

// Main fetch handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  const strategy = getCacheStrategy(request);
  
  event.respondWith((async () => {
    try {
      switch (strategy) {
        case 'cache-first':
          return await cacheFirst(request, STATIC_CACHE);
        
        case 'network-first':
          return await networkFirst(request, DYNAMIC_CACHE);
        
        case 'stale-while-revalidate':
          return await staleWhileRevalidate(request, API_CACHE);
        
        default:
          return await fetch(request);
      }
    } catch (error) {
      // Return offline fallback page if available
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
      
      // Return a basic offline response
      return new Response('Offline - Please check your connection', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  })());
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  let notificationData = {
    title: 'ATLAS Notification',
    body: 'You have a new notification',
    icon: '/favicon.png',
    badge: '/favicon.png',
    tag: 'atlas-notification',
    requireInteraction: false,
    data: {}
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        title: data.title || notificationData.title,
        body: data.message || data.body || notificationData.body,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge,
        tag: data.tag || `atlas-${Date.now()}`,
        requireInteraction: data.priority === 'urgent' || data.priority === 'high',
        data: {
          url: data.action_url || data.url || '/',
          notification_id: data.notification_id,
          notification_type: data.notification_type,
          priority: data.priority || 'normal'
        }
      };
    } catch (e) {
      console.error('[SW] Error parsing push data:', e);
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      data: notificationData.data,
      actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' }
      ],
      vibrate: notificationData.data.priority === 'urgent' ? [200, 100, 200] : [100]
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const url = event.notification.data?.url || '/admin/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message handler
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.map((name) => caches.delete(name)));
      }).then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
    );
  }
  
  if (event.data.type === 'GET_CACHE_STATUS') {
    event.waitUntil(
      Promise.all([
        caches.open(STATIC_CACHE).then(c => c.keys()),
        caches.open(API_CACHE).then(c => c.keys()),
        caches.open(ADMIN_CACHE).then(c => c.keys()),
      ]).then(([staticKeys, apiKeys, adminKeys]) => {
        event.ports[0]?.postMessage({
          static: staticKeys.length,
          api: apiKeys.length,
          admin: adminKeys.length,
          version: CACHE_VERSION
        });
      })
    );
  }
  
  if (event.data.type === 'GET_SUBSCRIPTION') {
    event.waitUntil(
      self.registration.pushManager.getSubscription().then((subscription) => {
        event.ports[0].postMessage({ subscription });
      })
    );
  }
});

// Background sync for API requests
self.addEventListener('sync', (event) => {
  console.log('[SW] Sync event:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
  
  if (event.tag === 'sync-api-requests') {
    event.waitUntil(syncApiRequests());
  }
});

async function syncNotifications() {
  console.log('[SW] Syncing notifications');
}

async function syncApiRequests() {
  console.log('[SW] Syncing queued API requests');
  
  try {
    const queue = await getQueuedRequests();
    
    for (const request of queue) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });
        
        if (response.ok) {
          await removeFromQueue(request.id);
          console.log('[SW] Synced request:', request.id);
        }
      } catch (error) {
        console.warn('[SW] Failed to sync request:', request.id, error);
      }
    }
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

async function getQueuedRequests() {
  // Get queue from IndexedDB or localStorage via message
  return new Promise((resolve) => {
    self.clients.matchAll().then((clients) => {
      if (clients.length > 0) {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data || []);
        };
        clients[0].postMessage({ type: 'GET_SYNC_QUEUE' }, [messageChannel.port2]);
        
        // Timeout after 2 seconds
        setTimeout(() => resolve([]), 2000);
      } else {
        resolve([]);
      }
    });
  });
}

async function removeFromQueue(requestId) {
  self.clients.matchAll().then((clients) => {
    if (clients.length > 0) {
      clients[0].postMessage({ type: 'REMOVE_FROM_QUEUE', requestId });
    }
  });
}
