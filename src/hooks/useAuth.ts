import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Dev mode bypass key - ONLY works in development environment
export const DEV_MODE_KEY = "huminex_dev_mode";
export const DEV_MODE_TYPE_KEY = "huminex_dev_mode_type";

// Check if dev mode is allowed (only in development builds)
const isDevModeAllowed = (): boolean => {
  return import.meta.env.DEV === true;
};

// Mock user for dev mode - ONLY available in development
const createMockUser = (type: "admin" | "client"): User | null => {
  if (!isDevModeAllowed()) {
    console.warn("Dev mode is not available in production builds");
    return null;
  }
  return {
    id: type === "admin" ? "dev-admin-user-id" : "dev-client-user-id",
    email: type === "admin" ? "admin@cropxon.dev" : "client@cropxon.dev",
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    user_metadata: { full_name: type === "admin" ? "Dev Admin" : "Dev Client" },
    created_at: new Date().toISOString(),
  } as User;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check for dev mode first - ONLY in development builds
    if (isDevModeAllowed()) {
      const devMode = localStorage.getItem(DEV_MODE_KEY) === "true";
      const devType = localStorage.getItem(DEV_MODE_TYPE_KEY) as "admin" | "client" | null;
      
      if (devMode && devType) {
        const mockUser = createMockUser(devType);
        if (mockUser) {
          setIsDevMode(true);
          setUser(mockUser);
          setLoading(false);
          return;
        }
      }
    } else {
      // Clear any dev mode flags in production
      localStorage.removeItem(DEV_MODE_KEY);
      localStorage.removeItem(DEV_MODE_TYPE_KEY);
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear dev mode
    localStorage.removeItem(DEV_MODE_KEY);
    localStorage.removeItem(DEV_MODE_TYPE_KEY);
    setIsDevMode(false);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const redirectUrl = `${window.location.origin}/portal`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Enable dev mode - ONLY works in development builds
  const enableDevMode = (type: "admin" | "client") => {
    if (!isDevModeAllowed()) {
      console.warn("Dev mode is disabled in production");
      return;
    }
    localStorage.setItem(DEV_MODE_KEY, "true");
    localStorage.setItem(DEV_MODE_TYPE_KEY, type);
    setIsDevMode(true);
    const mockUser = createMockUser(type);
    if (mockUser) {
      setUser(mockUser);
    }
  };

  return { user, session, loading, signOut, signUp, signIn, isDevMode, enableDevMode };
};
