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

interface GeolocationData {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org: string;
}

interface UseSessionRecordingOptions {
  enabled?: boolean;
  checkoutEveryNms?: number;
  privacySettings?: Partial<PrivacySettings>;
}

const defaultPrivacySettings: PrivacySettings = {
  maskAllInputs: true,
  maskPasswords: true,
  maskEmails: false,
  maskCreditCards: true,
  excludedPages: ["/admin/*", "/traceflow/*"],
  excludedSelectors: [".sensitive", "[data-private]", ".credit-card"],
  recordCanvas: false,
  collectFonts: false,
  inlineStylesheet: true,
};

// Generate device fingerprint from browser characteristics
const generateDeviceFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    navigator.maxTouchPoints || 0,
    // Canvas fingerprint (simplified)
    (() => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.textBaseline = "top";
          ctx.font = "14px Arial";
          ctx.fillText("fingerprint", 0, 0);
          return canvas.toDataURL().slice(-50);
        }
      } catch {
        return "no-canvas";
      }
      return "no-canvas";
    })(),
  ];
  
  // Create hash from components
  const str = components.join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

// Get or create visitor ID (persistent across sessions)
const getVisitorId = (): string => {
  const storageKey = "traceflow_visitor_id";
  let visitorId = localStorage.getItem(storageKey);
  
  if (!visitorId) {
    const fingerprint = generateDeviceFingerprint();
    visitorId = `v_${fingerprint}_${Date.now().toString(36)}`;
    localStorage.setItem(storageKey, visitorId);
  }
  
  return visitorId;
};

// Get session ID (persists until browser/tab closes)
const getSessionId = (): string => {
  const storageKey = "rrweb_session_id";
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(storageKey, sessionId);
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

// Fetch geolocation from IP
const fetchGeolocation = async (): Promise<GeolocationData | null> => {
  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      const data = await response.json();
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country_name,
        country_code: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        org: data.org,
      };
    }
  } catch {
    // Silently fail
  }
  return null;
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
  const visitorIdRef = useRef<string>(getVisitorId());
  const startTimeRef = useRef<Date>(new Date());
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const geolocationRef = useRef<GeolocationData | null>(null);
  const pagesVisitedRef = useRef<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const hasStartedRef = useRef(false);
  const lastEventCountRef = useRef(0);

  // Save events to database - upsert mode (consolidate into single session)
  const saveEvents = useCallback(async (isFinal = false) => {
    const newEventsCount = eventsRef.current.length;
    if (newEventsCount === 0 || newEventsCount === lastEventCountRef.current) return;

    // Get only new events since last save
    const newEvents = eventsRef.current.slice(lastEventCountRef.current);
    lastEventCountRef.current = newEventsCount;
    
    const sessionId = sessionIdRef.current;
    const visitorId = visitorIdRef.current;
    const now = new Date();
    const duration = now.getTime() - startTimeRef.current.getTime();

    // Track current page
    pagesVisitedRef.current.add(window.location.pathname);

    try {
      // First, try to find existing session to merge with
      const { data: existing } = await supabase
        .from("session_recordings")
        .select("id, events, pages_visited, event_count, start_time")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existing) {
        // Merge events with existing recording
        const existingEvents = Array.isArray(existing.events) ? existing.events : [];
        const existingPages = Array.isArray(existing.pages_visited) ? existing.pages_visited : [];
        
        // Add existing pages to our set
        existingPages.forEach((p: string) => pagesVisitedRef.current.add(p));
        
        const mergedEvents = [...existingEvents, ...newEvents];
        const mergedPages = Array.from(pagesVisitedRef.current);
        
        // Update start_time from original session
        const originalStart = new Date(existing.start_time);
        const totalDuration = now.getTime() - originalStart.getTime();

        recordingIdRef.current = existing.id;
        
        await supabase
          .from("session_recordings")
          .update({
            events: mergedEvents,
            event_count: mergedEvents.length,
            pages_visited: mergedPages,
            page_count: mergedPages.length,
            end_time: isFinal ? now.toISOString() : null,
            duration_ms: totalDuration,
            geolocation: geolocationRef.current || {},
            updated_at: now.toISOString(),
          })
          .eq("id", existing.id);
          
        console.log(`[rrweb] Merged ${newEvents.length} events into session (total: ${mergedEvents.length})`);
      } else {
        // Create new session record
        const { data } = await supabase
          .from("session_recordings")
          .insert({
            session_id: sessionId,
            visitor_id: visitorId,
            device_fingerprint: generateDeviceFingerprint(),
            ip_address: geolocationRef.current?.ip || null,
            geolocation: geolocationRef.current || {},
            user_agent: navigator.userAgent,
            events: newEvents,
            start_time: startTimeRef.current.toISOString(),
            end_time: isFinal ? now.toISOString() : null,
            duration_ms: duration,
            page_count: pagesVisitedRef.current.size,
            pages_visited: Array.from(pagesVisitedRef.current),
            event_count: newEvents.length,
            metadata: {
              screenWidth: window.innerWidth,
              screenHeight: window.innerHeight,
              url: window.location.pathname,
            },
          })
          .select("id")
          .single();

        if (data) {
          recordingIdRef.current = data.id;
          console.log(`[rrweb] Created new session with ${newEvents.length} events`);
        }
      }
    } catch (error) {
      console.error("[rrweb] Failed to save:", error);
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async () => {
    if (stopFnRef.current || hasStartedRef.current) return;
    if (isPageExcluded(privacy.excludedPages)) return;

    hasStartedRef.current = true;

    try {
      // Fetch geolocation in background
      fetchGeolocation().then(geo => {
        geolocationRef.current = geo;
      });

      const rrweb = await import("rrweb");
      
      startTimeRef.current = new Date();
      pagesVisitedRef.current.add(window.location.pathname);

      const blockSelectors = privacy.excludedSelectors.join(",");

      stopFnRef.current = rrweb.record({
        emit: (event) => {
          eventsRef.current.push(event);
        },
        checkoutEveryNms,
        sampling: {
          mousemove: false,
          mouseInteraction: true,
          scroll: 200,
          media: 800,
          input: "last",
        },
        recordCanvas: privacy.recordCanvas,
        collectFonts: privacy.collectFonts,
        inlineStylesheet: privacy.inlineStylesheet,
        maskAllInputs: privacy.maskAllInputs,
        blockSelector: blockSelectors || undefined,
        blockClass: 'rrweb-block',
      });

      setIsRecording(true);
      console.log("[rrweb] Recording started for visitor:", visitorIdRef.current, "session:", sessionIdRef.current);

      // Save events every 10 seconds for continuous recording
      saveIntervalRef.current = setInterval(() => {
        if (eventsRef.current.length > lastEventCountRef.current) {
          saveEvents(false);
        }
      }, 10000);
      
    } catch (err) {
      console.error("[rrweb] Failed to start recording:", err);
      hasStartedRef.current = false;
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
    hasStartedRef.current = false;
  }, [saveEvents]);

  useEffect(() => {
    if (!enabled) return;
    
    // Start recording after short delay
    const timeout = setTimeout(() => {
      if (!hasStartedRef.current) {
        startRecording();
      }
    }, 1500);

    const handleUnload = () => {
      // Final save before page unload
      if (eventsRef.current.length > 0) {
        const blob = new Blob([JSON.stringify({
          session_id: sessionIdRef.current,
          events: eventsRef.current,
          final: true
        })], { type: 'application/json' });
        
        // Use sendBeacon for reliable delivery on unload
        navigator.sendBeacon?.(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/session_recordings?on_conflict=session_id`,
          blob
        );
      }
      stopRecording();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Save when tab becomes hidden
        saveEvents(false);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopRecording();
    };
  }, [enabled, startRecording, stopRecording, saveEvents]);

  return {
    sessionId: sessionIdRef.current,
    visitorId: visitorIdRef.current,
    startRecording,
    stopRecording,
    eventCount: eventsRef.current.length,
    isRecording,
  };
};
