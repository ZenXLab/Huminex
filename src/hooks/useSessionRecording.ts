import { useEffect, useRef, useCallback } from "react";
import { record, EventType } from "rrweb";
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
  excludedPages: [], // Empty by default - record all pages
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
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save events to database
  const saveEvents = useCallback(async (isFinal = false) => {
    if (eventsRef.current.length === 0) return;

    const eventsCopy = [...eventsRef.current];
    const sessionId = sessionIdRef.current;
    const now = new Date();
    const duration = now.getTime() - startTimeRef.current.getTime();

    // Count unique pages
    const pages = new Set<string>();
    eventsCopy.forEach((event) => {
      if (event.type === EventType.Meta && event.data?.href) {
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
        // Update existing recording
        const { error } = await supabase
          .from("session_recordings")
          .update(recordingData)
          .eq("id", recordingIdRef.current);

        if (error) {
          console.error("Error updating session recording:", error);
        } else {
          console.log(`Updated recording ${recordingIdRef.current} with ${eventsCopy.length} events`);
        }
      } else {
        // Create new recording
        const { data, error } = await supabase
          .from("session_recordings")
          .insert(recordingData)
          .select("id")
          .single();

        if (error) {
          console.error("Error saving session recording:", error);
        } else if (data) {
          recordingIdRef.current = data.id;
          console.log(`Created new recording ${data.id} with ${eventsCopy.length} events`);
        }
      }
    } catch (err) {
      console.error("Failed to save session recording:", err);
    }
  }, [privacy]);

  // Start recording
  const startRecording = useCallback(() => {
    if (stopFnRef.current) return; // Already recording

    // Check if page is excluded
    if (isPageExcluded(privacy.excludedPages)) {
      console.log("Session recording disabled for this page:", window.location.pathname);
      return;
    }

    console.log("Starting rrweb session recording...");
    startTimeRef.current = new Date();
    eventsRef.current = [];
    recordingIdRef.current = null;

    // Build block selectors from privacy settings
    const blockSelectors = privacy.excludedSelectors.join(",");

    stopFnRef.current = record({
      emit: (event) => {
        eventsRef.current.push(event);
      },
      checkoutEveryNms,
      sampling: {
        mousemove: true,
        mouseInteraction: true,
        scroll: 150,
        media: 800,
        input: "last",
      },
      recordCanvas: privacy.recordCanvas,
      collectFonts: privacy.collectFonts,
      inlineStylesheet: privacy.inlineStylesheet,
      maskAllInputs: privacy.maskAllInputs,
      maskInputOptions: {
        password: privacy.maskPasswords,
        email: privacy.maskEmails,
        // @ts-ignore - credit card masking
        creditcard: privacy.maskCreditCards,
      },
      blockSelector: blockSelectors || undefined,
    });

    // Save events periodically
    saveIntervalRef.current = setInterval(() => {
      saveEvents(false);
    }, 10000); // Save every 10 seconds
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

    // Final save
    saveEvents(true);
    console.log("Stopped rrweb session recording");
  }, [saveEvents]);

  useEffect(() => {
    if (!enabled) return;

    startRecording();

    // Save on page unload
    const handleUnload = () => {
      stopRecording();
    };

    // Re-check on route change
    const handleRouteChange = () => {
      if (isPageExcluded(privacy.excludedPages)) {
        stopRecording();
      } else if (!stopFnRef.current) {
        startRecording();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      window.removeEventListener("popstate", handleRouteChange);
      stopRecording();
    };
  }, [enabled, startRecording, stopRecording, privacy.excludedPages]);

  return {
    sessionId: sessionIdRef.current,
    startRecording,
    stopRecording,
    eventCount: eventsRef.current.length,
    isRecording: !!stopFnRef.current,
  };
};
