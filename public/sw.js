// ATLAS Push Notification Service Worker
const CACHE_NAME = 'atlas-notifications-v1';

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing ATLAS Notification Service Worker');
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating ATLAS Notification Service Worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Push notification event handler
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
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
      console.error('[Service Worker] Error parsing push data:', e);
      notificationData.body = event.data.text();
    }
  }

  // Show the notification
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
  console.log('[Service Worker] Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const url = event.notification.data?.url || '/admin/notifications';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Try to focus an existing window
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      // Open a new window if none found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Notification close handler
self.addEventListener('notificationclose', (event) => {
  console.log('[Service Worker] Notification closed');
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_SUBSCRIPTION') {
    event.waitUntil(
      self.registration.pushManager.getSubscription().then((subscription) => {
        event.ports[0].postMessage({ subscription });
      })
    );
  }
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  console.log('[Service Worker] Syncing notifications');
  // Placeholder for syncing notifications when coming back online
}
