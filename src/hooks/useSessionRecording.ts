import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PrivacySettings {
  maskAllInputs: boolean;
  maskPasswords: boolean;
  maskEmails: boolean;
  maskCreditCards: boolean;
  excludedPages: string[];
  excludedSelectors: string[];
  recordCanvas: boolean;
  collectFonts: boolean;
  inlineStylesheet: boolean;
}

interface UseSessionRecordingOptions {
  enabled?: boolean;
  sampleRate?: number;
  checkoutEveryNms?: number;
  privacySettings?: Partial<PrivacySettings>;
}

const defaultPrivacySettings: PrivacySettings = {
  maskAllInputs: true,
  maskPasswords: true,
  maskEmails: false,
  maskCreditCards: true,
  excludedPages: ["/admin/*"], // Exclude admin pages by default to prevent issues
  excludedSelectors: [".sensitive", "[data-private]", ".credit-card"],
  recordCanvas: false,
  collectFonts: false,
  inlineStylesheet: true,
};

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("rrweb_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("rrweb_session_id", sessionId);
  }
  return sessionId;
};

// Check if current page should be excluded from recording
const isPageExcluded = (excludedPages: string[]): boolean => {
  const currentPath = window.location.pathname;
  return excludedPages.some(pattern => {
    if (pattern.endsWith("*")) {
      return currentPath.startsWith(pattern.slice(0, -1));
    }
    return currentPath === pattern;
  });
};

export const useSessionRecording = (options: UseSessionRecordingOptions = {}) => {
  const { 
    enabled = true, 
    checkoutEveryNms = 30000,
    privacySettings: customPrivacy = {}
  } = options;
  
  const privacy = { ...defaultPrivacySettings, ...customPrivacy };
  
  const eventsRef = useRef<any[]>([]);
  const stopFnRef = useRef<(() => void) | null>(null);
  const recordingIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string>(getSessionId());
  const startTimeRef = useRef<Date>(new Date());
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const rrwebLoadedRef = useRef(false);

  // Save events to database with error handling
  const saveEvents = useCallback(async (isFinal = false) => {
    if (eventsRef.current.length === 0) return;

    const eventsCopy = [...eventsRef.current];
    const sessionId = sessionIdRef.current;
    const now = new Date();
    const duration = now.getTime() - startTimeRef.current.getTime();

    // Count unique pages from meta events
    const pages = new Set<string>();
    eventsCopy.forEach((event) => {
      if (event.type === 4 && event.data?.href) { // EventType.Meta = 4
        pages.add(event.data.href);
      }
    });

    const recordingData = {
      session_id: sessionId,
      events: eventsCopy,
      start_time: startTimeRef.current.toISOString(),
      end_time: isFinal ? now.toISOString() : null,
      duration_ms: duration,
      page_count: Math.max(1, pages.size),
      event_count: eventsCopy.length,
      metadata: {
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        url: window.location.pathname,
        privacySettings: privacy,
      },
      updated_at: now.toISOString(),
    };

    try {
      if (recordingIdRef.current) {
        await supabase
          .from("session_recordings")
          .update(recordingData)
          .eq("id", recordingIdRef.current);
      } else {
        const { data } = await supabase
          .from("session_recordings")
          .insert(recordingData)
          .select("id")
          .single();

        if (data) {
          recordingIdRef.current = data.id;
        }
      }
    } catch {
      // Silently fail to avoid console spam
    }
  }, [privacy]);

  // Start recording - lazy load rrweb to avoid blocking
  const startRecording = useCallback(async () => {
    if (stopFnRef.current) return; // Already recording
    if (isPageExcluded(privacy.excludedPages)) return;

    try {
      // Lazy load rrweb only when needed
      if (!rrwebLoadedRef.current) {
        const rrweb = await import("rrweb");
        rrwebLoadedRef.current = true;
        
        startTimeRef.current = new Date();
        eventsRef.current = [];
        recordingIdRef.current = null;

        const blockSelectors = privacy.excludedSelectors.join(",");

        stopFnRef.current = rrweb.record({
          emit: (event) => {
            eventsRef.current.push(event);
          },
          checkoutEveryNms,
          sampling: {
            mousemove: false, // Disable for performance
            mouseInteraction: true,
            scroll: 300, // Reduce frequency
            media: 800,
            input: "last",
          },
          recordCanvas: false,
          collectFonts: false,
          inlineStylesheet: false, // Disable for performance
          maskAllInputs: privacy.maskAllInputs,
          blockSelector: blockSelectors || undefined,
        });

        setIsRecording(true);

        // Save events less frequently (30 seconds)
        saveIntervalRef.current = setInterval(() => {
          saveEvents(false);
        }, 30000);
      }
    } catch {
      // rrweb failed to load - silently fail
    }
  }, [checkoutEveryNms, saveEvents, privacy]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (stopFnRef.current) {
      stopFnRef.current();
      stopFnRef.current = null;
    }

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }

    setIsRecording(false);
    saveEvents(true);
  }, [saveEvents]);

  useEffect(() => {
    if (!enabled) return;
    
    // Delay start to not block initial page load
    const timeout = setTimeout(() => {
      startRecording();
    }, 3000);

    const handleUnload = () => stopRecording();

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      stopRecording();
    };
  }, [enabled, startRecording, stopRecording]);

  return {
    sessionId: sessionIdRef.current,
    startRecording,
    stopRecording,
    eventCount: eventsRef.current.length,
    isRecording,
  };
};
