import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const generateSessionId = () => {
  const existing = sessionStorage.getItem("clickstream_session");
  if (existing) return existing;
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("clickstream_session", sessionId);
  return sessionId;
};

// Cache geolocation data to avoid repeated API calls
const getGeolocation = async (): Promise<Record<string, any> | null> => {
  const cached = sessionStorage.getItem("clickstream_geolocation");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // Invalid cache, fetch fresh
    }
  }

  try {
    // Try ipapi.co first
    const response = await fetch("https://ipapi.co/json/", { 
      signal: AbortSignal.timeout(3000) 
    });
    if (response.ok) {
      const data = await response.json();
      const geoData = {
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
      sessionStorage.setItem("clickstream_geolocation", JSON.stringify(geoData));
      return geoData;
    }
  } catch (e) {
    console.warn("Primary geolocation API failed, trying fallback");
  }

  try {
    // Fallback to ip-api.com
    const response = await fetch("http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,query", {
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        const geoData = {
          ip: data.query,
          city: data.city,
          region: data.regionName,
          country: data.country,
          country_code: data.countryCode,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          org: data.org || data.isp,
        };
        sessionStorage.setItem("clickstream_geolocation", JSON.stringify(geoData));
        return geoData;
      }
    }
  } catch (e) {
    console.warn("Fallback geolocation API also failed");
  }

  return null;
};

export const useClickstream = () => {
  const { user } = useAuth();
  const sessionId = generateSessionId();
  const geoDataRef = useRef<Record<string, any> | null>(null);
  const geoFetchedRef = useRef(false);

  // Fetch geolocation on mount
  useEffect(() => {
    if (!geoFetchedRef.current) {
      geoFetchedRef.current = true;
      getGeolocation().then(data => {
        geoDataRef.current = data;
      });
    }
  }, []);

  // Only use user.id if it's a valid UUID (not dev mode)
  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const trackEvent = useCallback(async (
    eventType: string,
    metadata?: Record<string, any>,
    element?: HTMLElement
  ) => {
    try {
      // Only pass user_id if it's a valid UUID, otherwise use null
      const userId = user?.id && isValidUUID(user.id) ? user.id : null;
      
      // Merge geolocation data with provided metadata
      const enrichedMetadata = {
        ...metadata,
        geolocation: geoDataRef.current,
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      };
      
      await supabase.from("clickstream_events").insert({
        session_id: sessionId,
        user_id: userId,
        event_type: eventType,
        page_url: window.location.pathname,
        element_id: element?.id || null,
        element_class: element?.className?.toString().slice(0, 200) || null,
        element_text: element?.textContent?.slice(0, 100) || null,
        metadata: enrichedMetadata,
      });
    } catch (error) {
      console.error("Clickstream tracking error:", error);
    }
  }, [sessionId, user?.id]);

  useEffect(() => {
    // Track page view
    trackEvent("pageview");

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveElement = target.closest("button, a, [role='button'], input[type='submit']");
      
      if (interactiveElement) {
        trackEvent("click", {
          tagName: interactiveElement.tagName,
          href: (interactiveElement as HTMLAnchorElement).href || null,
        }, interactiveElement as HTMLElement);
      }
    };

    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        trackEvent("scroll", { depth: scrollPercent });
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [trackEvent]);

  return { trackEvent };
};
