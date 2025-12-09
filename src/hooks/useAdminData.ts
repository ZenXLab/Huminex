import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo } from "react";

// Centralized admin data hooks with stale-while-revalidate caching
// Shows cached data instantly while refreshing in background

// Aggressive caching for instant display with background refresh
const STALE_TIME = 2 * 60 * 1000; // 2 minutes - data shown instantly, refreshed in background after this
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes - keep cached data for longer
const BACKGROUND_REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes - auto-refresh

// Stats hook for dashboard overview - stale-while-revalidate pattern
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Parallel fetch all stats with optimized queries (head: true for count only)
      const [
        quotesResult,
        pendingQuotesResult,
        invoicesResult,
        paidInvoicesResult,
        usersResult,
        inquiriesResult,
        pendingOnboardingsResult,
        activeTenantsResult,
      ] = await Promise.all([
        supabase.from("quotes").select("*", { count: "exact", head: true }),
        supabase.from("quotes").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("invoices").select("*", { count: "exact", head: true }),
        supabase.from("invoices").select("total_amount").eq("status", "paid").limit(100),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }),
        supabase.from("onboarding_sessions").select("*", { count: "exact", head: true }).in("status", ["new", "pending", "pending_approval", "verified"]),
        supabase.from("client_tenants").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);

      const totalRevenue = paidInvoicesResult.data?.reduce((sum, i) => sum + Number(i.total_amount || 0), 0) || 0;

      return {
        totalQuotes: quotesResult.count || 0,
        pendingQuotes: pendingQuotesResult.count || 0,
        totalInvoices: invoicesResult.count || 0,
        totalRevenue,
        totalUsers: usersResult.count || 0,
        totalInquiries: inquiriesResult.count || 0,
        pendingOnboarding: pendingOnboardingsResult.count || 0,
        activeTenants: activeTenantsResult.count || 0,
      };
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Use cached data on mount
    refetchInterval: BACKGROUND_REFETCH_INTERVAL, // Background refresh
    placeholderData: (previousData) => previousData, // Show previous data while loading
  });
};

// Recent quotes hook - stale-while-revalidate
export const useRecentQuotes = (limit = 5) => {
  return useQuery({
    queryKey: ["admin-recent-quotes", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("id, quote_number, contact_name, contact_email, service_type, final_price, status, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

// All quotes hook - stale-while-revalidate
export const useAllQuotes = () => {
  return useQuery({
    queryKey: ["admin-all-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

// Pending onboardings hook - stale-while-revalidate
export const usePendingOnboardings = (limit = 5) => {
  return useQuery({
    queryKey: ["admin-pending-onboardings", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_sessions")
        .select("id, client_id, full_name, email, company_name, client_type, status, created_at")
        .in("status", ["new", "pending", "pending_approval", "verified"])
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

// Recent tenants hook - stale-while-revalidate
export const useRecentTenants = (limit = 5) => {
  return useQuery({
    queryKey: ["admin-recent-tenants", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_tenants")
        .select("id, name, slug, tenant_type, status, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

// All tenants hook - stale-while-revalidate
export const useAllTenants = () => {
  return useQuery({
    queryKey: ["admin-all-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

// Audit logs hook - stale-while-revalidate
export const useAuditLogs = (limit = 50) => {
  return useQuery({
    queryKey: ["admin-audit-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action, entity_type, entity_id, user_id, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

// Clickstream events hook - stale-while-revalidate with aggressive caching
export const useClickstreamEvents = (
  eventFilter: string = "all",
  timeRange: string = "24h",
  customDateRange?: { from: Date; to: Date } | null
) => {
  return useQuery({
    queryKey: ["clickstream-events", eventFilter, timeRange, customDateRange?.from?.toISOString(), customDateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("clickstream_events")
        .select("id, session_id, event_type, page_url, element_text, created_at")
        .order("created_at", { ascending: false })
        .limit(50); // Further reduced for instant load

      if (eventFilter !== "all") {
        query = query.eq("event_type", eventFilter);
      }

      if (timeRange === "custom" && customDateRange) {
        query = query
          .gte("created_at", customDateRange.from.toISOString())
          .lte("created_at", customDateRange.to.toISOString());
      } else {
        const timeFilters: Record<string, number> = {
          "1h": 1, "24h": 24, "7d": 168, "30d": 720, "90d": 2160,
        };
        if (timeFilters[timeRange]) {
          const since = new Date();
          since.setHours(since.getHours() - timeFilters[timeRange]);
          query = query.gte("created_at", since.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 60000, // 1 minute - show cached data instantly
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData,
  });
};

// Real-time subscription hook for admin dashboard - optimized with longer debounce
export const useAdminRealtime = (tables: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channels = tables.map((table) => {
      return supabase
        .channel(`admin-${table}-changes`)
        .on("postgres_changes", { event: "*", schema: "public", table }, () => {
          // Longer debounce to prevent rapid re-renders (2 seconds)
          const timeoutId = setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: [`admin-${table}`] });
          }, 2000);
          return () => clearTimeout(timeoutId);
        })
        .subscribe();
    });

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [queryClient, tables.join(",")]);
};

// Memoized table filter hook
export const useTableFilter = <T extends Record<string, any>>(
  data: T[] | undefined,
  searchTerm: string,
  searchFields: (keyof T)[]
) => {
  return useMemo(() => {
    if (!data || !searchTerm) return data || [];
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((item) =>
      searchFields.some((field) =>
        String(item[field] || "").toLowerCase().includes(lowerSearch)
      )
    );
  }, [data, searchTerm, searchFields.join(",")]);
};
