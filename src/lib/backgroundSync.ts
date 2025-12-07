// Background Sync Manager for Offline API Requests

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
  timestamp: number;
  retryCount: number;
}

const SYNC_QUEUE_KEY = 'atlas-sync-queue';
const MAX_RETRIES = 3;

class BackgroundSyncManager {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private listeners: Set<(syncing: boolean, queueSize: number) => void> = new Set();

  constructor() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  private handleOnline() {
    this.isOnline = true;
    console.log('[Sync] Back online, processing queue...');
    this.processQueue();
  }

  private handleOffline() {
    this.isOnline = false;
    console.log('[Sync] Gone offline');
  }

  subscribe(callback: (syncing: boolean, queueSize: number) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notify() {
    const queue = this.getQueue();
    this.listeners.forEach(cb => cb(this.syncInProgress, queue.length));
  }

  private getQueue(): QueuedRequest[] {
    try {
      const stored = localStorage.getItem(SYNC_QUEUE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveQueue(queue: QueuedRequest[]) {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    this.notify();
  }

  async queueRequest(url: string, options: RequestInit): Promise<void> {
    const request: QueuedRequest = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url,
      method: options.method || 'POST',
      headers: Object.fromEntries(new Headers(options.headers).entries()),
      body: options.body as string | null,
      timestamp: Date.now(),
      retryCount: 0,
    };

    const queue = this.getQueue();
    queue.push(request);
    this.saveQueue(queue);

    console.log('[Sync] Request queued:', request.id);

    // Try to register background sync if available
    if ('serviceWorker' in navigator && 'sync' in (window as any).SyncManager) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).sync.register('sync-api-requests');
      } catch (err) {
        console.warn('[Sync] Background sync registration failed:', err);
      }
    }
  }

  async processQueue(): Promise<{ success: number; failed: number }> {
    if (this.syncInProgress || !this.isOnline) {
      return { success: 0, failed: 0 };
    }

    this.syncInProgress = true;
    this.notify();

    const queue = this.getQueue();
    let success = 0;
    let failed = 0;
    const remainingQueue: QueuedRequest[] = [];

    for (const request of queue) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });

        if (response.ok) {
          success++;
          console.log('[Sync] Request synced:', request.id);
        } else if (response.status >= 500) {
          // Server error, retry later
          if (request.retryCount < MAX_RETRIES) {
            request.retryCount++;
            remainingQueue.push(request);
          } else {
            failed++;
          }
        } else {
          // Client error, don't retry
          failed++;
        }
      } catch (error) {
        // Network error, retry later
        if (request.retryCount < MAX_RETRIES) {
          request.retryCount++;
          remainingQueue.push(request);
        } else {
          failed++;
        }
      }
    }

    this.saveQueue(remainingQueue);
    this.syncInProgress = false;
    this.notify();

    return { success, failed };
  }

  getQueueSize(): number {
    return this.getQueue().length;
  }

  isSyncing(): boolean {
    return this.syncInProgress;
  }

  clearQueue(): void {
    this.saveQueue([]);
  }
}

export const backgroundSync = new BackgroundSyncManager();

// Enhanced fetch wrapper that queues failed requests
export async function syncableFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Only queue POST/PUT/PATCH/DELETE requests
  const shouldQueue = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(
    options.method?.toUpperCase() || 'GET'
  );

  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    if (!navigator.onLine && shouldQueue) {
      await backgroundSync.queueRequest(url, options);
      // Return a synthetic response indicating the request was queued
      return new Response(JSON.stringify({ queued: true }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw error;
  }
}
