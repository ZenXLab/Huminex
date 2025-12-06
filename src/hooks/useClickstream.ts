import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

const generateSessionId = () => {
  const existing = sessionStorage.getItem("clickstream_session");
  if (existing) return existing;
  const sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("clickstream_session", sessionId);
  return sessionId;
};

export const useClickstream = () => {
  const { user } = useAuth();
  const sessionId = generateSessionId();

  const trackEvent = useCallback(async (
    eventType: string,
    metadata?: Record<string, any>,
    element?: HTMLElement
  ) => {
    try {
      await supabase.from("clickstream_events").insert({
        session_id: sessionId,
        user_id: user?.id || null,
        event_type: eventType,
        page_url: window.location.pathname,
        element_id: element?.id || null,
        element_class: element?.className?.toString().slice(0, 200) || null,
        element_text: element?.textContent?.slice(0, 100) || null,
        metadata: metadata || {},
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
