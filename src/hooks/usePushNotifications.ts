import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  isLoading: boolean;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'unsupported',
    isSubscribed: false,
    subscription: null,
    isLoading: true,
  });

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    const isSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        isSupported: false,
        permission: 'unsupported',
        isLoading: false,
      }));
      return;
    }

    const permission = Notification.permission;
    let subscription: PushSubscription | null = null;

    try {
      const registration = await navigator.serviceWorker.ready;
      subscription = await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Error checking push subscription:', error);
    }

    setState({
      isSupported: true,
      permission,
      isSubscribed: !!subscription,
      subscription,
      isLoading: false,
    });
  };

  const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    if (!('serviceWorker' in navigator)) {
      console.error('Service workers not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('Service Worker registered:', registration);
      
      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const permission = await Notification.requestPermission();
      
      setState(prev => ({
        ...prev,
        permission,
        isLoading: false,
      }));

      if (permission === 'granted') {
        toast.success('Push notifications enabled');
        return true;
      } else if (permission === 'denied') {
        toast.error('Push notification permission denied');
        return false;
      } else {
        toast.info('Push notification permission dismissed');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to request notification permission');
      return false;
    }
  }, [state.isSupported]);

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.isSupported) {
      toast.error('Push notifications are not supported');
      return null;
    }

    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const registration = await registerServiceWorker();
      if (!registration) {
        throw new Error('Failed to register service worker');
      }

      // Note: In production, you would use your VAPID public key here
      // For now, we'll skip the actual push subscription since it requires server setup
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        setState(prev => ({
          ...prev,
          isSubscribed: true,
          subscription,
          isLoading: false,
        }));
        toast.success('Push notifications subscribed');
        return subscription;
      }

      // Without VAPID keys, we can't create a real subscription
      // but we can still enable local notifications
      setState(prev => ({
        ...prev,
        isSubscribed: true,
        isLoading: false,
      }));
      
      toast.success('Notifications enabled');
      return null;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to subscribe to push notifications');
      return null;
    }
  }, [state.isSupported, state.permission, requestPermission]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      setState(prev => ({ ...prev, isSubscribed: false }));
      return true;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await state.subscription.unsubscribe();
      
      setState(prev => ({
        ...prev,
        isSubscribed: false,
        subscription: null,
        isLoading: false,
      }));
      
      toast.success('Push notifications unsubscribed');
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      setState(prev => ({ ...prev, isLoading: false }));
      toast.error('Failed to unsubscribe from push notifications');
      return false;
    }
  }, [state.subscription]);

  const showLocalNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        icon: '/favicon.png',
        badge: '/favicon.png',
        ...options,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
      // Fallback to regular notification
      new Notification(title, {
        icon: '/favicon.png',
        ...options,
      });
    }
  }, [state.permission, requestPermission]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    showLocalNotification,
    refresh: checkSupport,
  };
}
