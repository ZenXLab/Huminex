import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface TraceflowUser {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  role: "admin" | "owner" | "member" | "viewer";
  plan: string;
  subscriptionStatus: "active" | "trial" | "pending_payment" | "cancelled";
  features: string[];
}

export const useTraceflowAuth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [traceflowUser, setTraceflowUser] = useState<TraceflowUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchTraceflowUser = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is ATLAS admin
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        const isAdminUser = roleData?.role === "admin";
        setIsAdmin(isAdminUser);

        // Get subscription data
        const { data: subscription } = await supabase
          .from("traceflow_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        // Get user features (RBAC)
        const { data: userFeatures } = await supabase
          .from("traceflow_user_features")
          .select("feature_id, is_enabled")
          .eq("user_id", user.id);

        const enabledFeatures = userFeatures
          ?.filter((f) => f.is_enabled)
          .map((f) => f.feature_id) || [];

        // Build TraceflowUser with proper type casting
        const role = isAdminUser ? "admin" : (subscription?.role as "admin" | "owner" | "member" | "viewer" || "member");
        const plan = isAdminUser ? "enterprise" : (subscription?.plan || "starter");
        const status = isAdminUser ? "active" : (subscription?.status as "active" | "trial" | "pending_payment" | "cancelled" || "pending_payment");
        
        setTraceflowUser({
          id: user.id,
          email: user.email || "",
          fullName: user.user_metadata?.full_name || "",
          companyName: user.user_metadata?.company_name || "",
          role,
          plan,
          subscriptionStatus: status,
          features: isAdminUser 
            ? ["all"] // Admins have access to all features
            : enabledFeatures,
        });
      } catch (error) {
        console.error("Error fetching Traceflow user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading) {
      fetchTraceflowUser();
    }
  }, [user, authLoading]);

  const hasFeature = (featureId: string): boolean => {
    if (!traceflowUser) return false;
    if (traceflowUser.features.includes("all")) return true;
    return traceflowUser.features.includes(featureId);
  };

  const requireAuth = () => {
    if (!authLoading && !user) {
      navigate("/traceflow/login");
      return false;
    }
    return true;
  };

  const requireSubscription = () => {
    if (!traceflowUser) return false;
    if (traceflowUser.subscriptionStatus === "active" || traceflowUser.subscriptionStatus === "trial") {
      return true;
    }
    navigate("/traceflow/onboarding");
    return false;
  };

  return {
    user: traceflowUser,
    isLoading: isLoading || authLoading,
    isAdmin,
    hasFeature,
    requireAuth,
    requireSubscription,
  };
};
