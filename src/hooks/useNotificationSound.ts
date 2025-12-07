import { useCallback, useRef } from 'react';

// Base64 encoded notification sound (short chime)
const NOTIFICATION_SOUND_BASE64 = 'data:audio/mp3;base64,//uQxAAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7kMQAAAeYAT+UAAAI4gAnspIAAAP+Af/wA//6wAGBAIBgOB/8P/B/wf//+AEAIDA4HA4HBw8PDw8PeIAAAAAAAAA';

// Alternative notification sounds
const SOUND_EFFECTS = {
  default: NOTIFICATION_SOUND_BASE64,
  chime: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onq+2ubSwpJqNgXVqY11ZWFxiaXN/iquwtbOxrqilnpaNgXVpXlRQTU1PVl5odoSRoa2xtbOxraqjmY6Bd2xhWFBMSkxPVl1meIOPnKmxt7m3sq2mnpGFd2thWVJOTU5RV19qeImWo622ub27t7GqopaJfnJoYFhST05PUlhfaHaEkZ+qt7y+vLi0rqabj4N3bWReWVZVVllganmGk5+qt7y/vby4sqykl4uAdGtiXFlXWFphanyIlZ+qt7y+vr28t7Gpo5eKfnJpYl1aWVpdZXF+ipensLi9v8C+urStpZmOg3htZV9cW1xfZW55hpKdqbO6vcDAvrq2r6iglYl+c2tkX11cXWFndYGNmKSvuL3Awb++u7WuqKCVin5zaWNfXV1fY2l2gY2YpK+4vb/AwL68t7GqpJqPg3htZWBdXV9ja3eCjpmlsLm+wMDAv7y3saumm5CEdmxlYF5dX2JoeYWQm6exuLzAwMC/vbm0rqihlo2Bd2xkYF5dX2Fnc4CKlqCrtbq+wMDAv7y4tK+qo5iNgXVrYl9dXF5iZ3N/i5airbW6vcDAwL++ura',
  success: 'data:audio/wav;base64,UklGRl9vT19telegramCBXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ==',
  error: 'data:audio/wav;base64,UklGRl9vT19telegramCBXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ=='
};

type SoundType = 'default' | 'chime' | 'success' | 'error';

interface UseNotificationSoundOptions {
  volume?: number;
  enabled?: boolean;
}

export function useNotificationSound(options: UseNotificationSoundOptions = {}) {
  const { volume = 0.5, enabled = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);

  const playSound = useCallback((type: SoundType = 'default') => {
    if (!enabled) return;

    // Debounce - don't play sounds too frequently
    const now = Date.now();
    if (now - lastPlayedRef.current < 300) return;
    lastPlayedRef.current = now;

    try {
      // Create new audio element or reuse existing
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.src = SOUND_EFFECTS[type] || SOUND_EFFECTS.default;
      audio.volume = Math.min(1, Math.max(0, volume));
      
      // Play the sound
      audio.currentTime = 0;
      audio.play().catch((error) => {
        // Silently fail - user interaction may be required
        console.debug('Could not play notification sound:', error.message);
      });
    } catch (error) {
      console.debug('Error creating audio:', error);
    }
  }, [enabled, volume]);

  const playDefaultSound = useCallback(() => playSound('default'), [playSound]);
  const playSuccessSound = useCallback(() => playSound('success'), [playSound]);
  const playErrorSound = useCallback(() => playSound('error'), [playSound]);
  const playChimeSound = useCallback(() => playSound('chime'), [playSound]);

  return {
    playSound,
    playDefaultSound,
    playSuccessSound,
    playErrorSound,
    playChimeSound
  };
}
