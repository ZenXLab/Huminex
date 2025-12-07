// Service Worker Registration and Management

export interface CacheStatus {
  static: number;
  api: number;
  admin: number;
  version: string;
}

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Service workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    });

    swRegistration = registration;

    console.log('[SW] Service worker registered:', registration.scope);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[SW] New version available');
            // Optionally show update notification to user
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[SW] Registration failed:', error);
    return null;
  }
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!swRegistration) {
    return false;
  }

  try {
    const success = await swRegistration.unregister();
    if (success) {
      swRegistration = null;
      console.log('[SW] Service worker unregistered');
    }
    return success;
  } catch (error) {
    console.error('[SW] Unregister failed:', error);
    return false;
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting(): void {
  if (swRegistration?.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker.controller) {
      resolve(false);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data?.success || false);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'CLEAR_CACHE' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}

/**
 * Get cache status
 */
export async function getCacheStatus(): Promise<CacheStatus | null> {
  return new Promise((resolve) => {
    if (!navigator.serviceWorker.controller) {
      resolve(null);
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data as CacheStatus);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_STATUS' },
      [messageChannel.port2]
    );

    // Timeout after 5 seconds
    setTimeout(() => resolve(null), 5000);
  });
}

/**
 * Check if service worker is ready
 */
export async function waitForServiceWorker(): Promise<ServiceWorkerRegistration> {
  return navigator.serviceWorker.ready;
}

/**
 * Check if app is running from cache (offline capable)
 */
export function isOfflineCapable(): boolean {
  return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
}
