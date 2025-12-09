import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types
export interface TraceflowTeamMember {
  id: string;
  subscription_id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: "owner" | "admin" | "analyst" | "viewer";
  status: "pending" | "active" | "suspended" | "removed";
  invited_at: string;
  accepted_at: string | null;
}

export interface TraceflowFeatureAccess {
  id: string;
  subscription_id: string;
  feature_id: string;
  feature_name: string;
  feature_description: string | null;
  is_enabled: boolean;
  enabled_for_roles: string[];
  usage_limit: number | null;
  current_usage: number;
}

export interface TraceflowAuditLog {
  id: string;
  subscription_id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  old_value: any;
  new_value: any;
  ip_address: string | null;
  created_at: string;
}

// Default features for TRACEFLOW
export const TRACEFLOW_FEATURES = [
  { id: "capture_engine", name: "Universal Capture Engine", description: "Auto-capture clicks, gestures, errors, and performance signals" },
  { id: "session_intelligence", name: "AI Session Intelligence", description: "AI summaries, root-cause analysis, and fix suggestions" },
  { id: "ux_intelligence", name: "UX Intelligence", description: "Heatmaps, dead clicks, design auditor" },
  { id: "journey_intelligence", name: "Journey Intelligence", description: "Auto-funnels, drop-off causality, conversion simulator" },
  { id: "product_intelligence", name: "Product Intelligence", description: "Feature usage, retention, churn prediction" },
  { id: "observability", name: "Experience Observability", description: "OTel traces, service maps, API correlation" },
  { id: "multimodal_ai", name: "Multi-Modal AI", description: "Voice, text, sentiment fusion with sessions" },
  { id: "ai_operations", name: "AI Operations", description: "Multi-agent auto-ticketing and monitoring" },
  { id: "revenue_insights", name: "Revenue & Growth Intelligence", description: "Financial impact and ROI quantification" },
  { id: "enterprise_trust", name: "Enterprise Trust Layer", description: "SSO, audit logs, compliance, tokenization" },
  { id: "api_access", name: "API & SDK Access", description: "Full API access and custom integrations" },
];

// Team Members Hooks
export function useTraceflowTeam(subscriptionId: string | undefined) {
  return useQuery({
    queryKey: ["traceflow-team", subscriptionId],
    queryFn: async () => {
      if (!subscriptionId) return [];
      const { data, error } = await supabase
        .from("traceflow_team_members")
        .select("*")
        .eq("subscription_id", subscriptionId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as TraceflowTeamMember[];
    },
    enabled: !!subscriptionId,
  });
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ subscriptionId, email, role, fullName }: { 
      subscriptionId: string; 
      email: string; 
      role: string;
      fullName?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("traceflow_team_members")
        .insert([{
          subscription_id: subscriptionId,
          user_id: crypto.randomUUID(),
          email,
          full_name: fullName,
          role: role as "owner" | "admin" | "analyst" | "viewer",
          invited_by: user?.id,
          status: "pending",
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["traceflow-team", variables.subscriptionId] });
      toast.success("Team member invited successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to invite team member");
    },
  });
}

export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { 
      id: string; 
      updates: Partial<TraceflowTeamMember>;
    }) => {
      const { data, error } = await supabase
        .from("traceflow_team_members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traceflow-team"] });
      toast.success("Team member updated");
    },
  });
}

// Feature Access Hooks
export function useTraceflowFeatures(subscriptionId: string | undefined) {
  return useQuery({
    queryKey: ["traceflow-features", subscriptionId],
    queryFn: async () => {
      if (!subscriptionId) return [];
      const { data, error } = await supabase
        .from("traceflow_feature_access")
        .select("*")
        .eq("subscription_id", subscriptionId);
      if (error) throw error;
      return data as TraceflowFeatureAccess[];
    },
    enabled: !!subscriptionId,
  });
}

type TraceflowRoleType = "owner" | "admin" | "analyst" | "viewer";

export function useInitializeFeatures() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ subscriptionId, plan }: { subscriptionId: string; plan: string }) => {
      // Determine which features to enable based on plan
      const enabledFeatures = TRACEFLOW_FEATURES.map(f => {
        let isEnabled = false;
        let roles: TraceflowRoleType[] = ["owner", "admin"];
        
        // Starter plan - basic features
        if (plan === "starter") {
          isEnabled = ["capture_engine", "session_intelligence", "ux_intelligence"].includes(f.id);
        }
        // Pro plan - more features
        else if (plan === "pro") {
          isEnabled = ["capture_engine", "session_intelligence", "ux_intelligence", "journey_intelligence", "product_intelligence", "api_access"].includes(f.id);
          roles = ["owner", "admin", "analyst"];
        }
        // Business plan - most features
        else if (plan === "business") {
          isEnabled = !["enterprise_trust"].includes(f.id);
          roles = ["owner", "admin", "analyst", "viewer"] as TraceflowRoleType[];
        }
        // Enterprise - all features
        else if (plan === "enterprise") {
          isEnabled = true;
          roles = ["owner", "admin", "analyst", "viewer"];
        }
        
        return {
          subscription_id: subscriptionId,
          feature_id: f.id,
          feature_name: f.name,
          feature_description: f.description,
          is_enabled: isEnabled,
          enabled_for_roles: roles,
        };
      });
      
      const { error } = await supabase
        .from("traceflow_feature_access")
        .upsert(enabledFeatures, { onConflict: "subscription_id,feature_id" });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["traceflow-features", variables.subscriptionId] });
    },
  });
}

export function useToggleFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, isEnabled, subscriptionId }: { 
      id: string; 
      isEnabled: boolean;
      subscriptionId: string;
    }) => {
      const { data, error } = await supabase
        .from("traceflow_feature_access")
        .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Log the action
      await supabase.from("traceflow_audit_logs").insert({
        subscription_id: subscriptionId,
        action: isEnabled ? "feature_enabled" : "feature_disabled",
        resource_type: "feature",
        resource_id: id,
        new_value: { is_enabled: isEnabled },
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["traceflow-features"] });
      toast.success("Feature updated");
    },
  });
}

// Audit Logs Hook
export function useTraceflowAuditLogs(subscriptionId: string | undefined, limit: number = 50) {
  return useQuery({
    queryKey: ["traceflow-audit-logs", subscriptionId, limit],
    queryFn: async () => {
      if (!subscriptionId) return [];
      const { data, error } = await supabase
        .from("traceflow_audit_logs")
        .select("*")
        .eq("subscription_id", subscriptionId)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as TraceflowAuditLog[];
    },
    enabled: !!subscriptionId,
  });
}

// Real-time subscriptions
export function useTraceflowRealtime(subscriptionId: string | undefined) {
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!subscriptionId) return;

    // Subscribe to sessions in real-time
    const sessionsChannel = supabase
      .channel("traceflow-sessions-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "traceflow_sessions" },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["traceflow-sessions"] });
          queryClient.invalidateQueries({ queryKey: ["traceflow-stats"] });
          
          if (payload.eventType === "INSERT") {
            toast.info("New session detected", { duration: 2000 });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    // Subscribe to UX issues
    const uxIssuesChannel = supabase
      .channel("traceflow-ux-issues-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "traceflow_ux_issues" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["traceflow-ux-issues"] });
        }
      )
      .subscribe();

    // Subscribe to NeuroRouter logs
    const neuroRouterChannel = supabase
      .channel("traceflow-neurorouter-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "traceflow_neurorouter_logs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["neurorouter-logs"] });
        }
      )
      .subscribe();

    // Subscribe to audit logs
    const auditChannel = supabase
      .channel("traceflow-audit-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "traceflow_audit_logs" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["traceflow-audit-logs", subscriptionId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(uxIssuesChannel);
      supabase.removeChannel(neuroRouterChannel);
      supabase.removeChannel(auditChannel);
    };
  }, [subscriptionId, queryClient]);

  return { isConnected };
}

// Check feature access for current user
export function useCanAccessFeature(featureId: string, subscriptionId: string | undefined, userRole: string | undefined) {
  const { data: features } = useTraceflowFeatures(subscriptionId);
  
  if (!features || !userRole) return false;
  
  const feature = features.find(f => f.feature_id === featureId);
  if (!feature) return false;
  
  return feature.is_enabled && feature.enabled_for_roles.includes(userRole);
}
