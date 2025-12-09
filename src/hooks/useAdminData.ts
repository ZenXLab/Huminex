import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useCallback, useMemo } from "react";

// Centralized admin data hooks with caching and optimization

// Optimized cache times for faster perceived performance
const STALE_TIME = 60 * 1000; // 1 minute - increased for less refetching
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes - longer cache

// Stats hook for dashboard overview - optimized with parallel fetching
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
        supabase.from("invoices").select("total_amount").eq("status", "paid").limit(100), // Limit for performance
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
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
  });
};

// Recent quotes hook - optimized with smaller payload
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
  });
};

// All quotes hook with pagination - optimized with limit
export const useAllQuotes = () => {
  return useQuery({
    queryKey: ["admin-all-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200); // Limit for faster load
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

// Pending onboardings hook - optimized
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
  });
};

// Recent tenants hook - optimized
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
  });
};

// All tenants hook - optimized with limit
export const useAllTenants = () => {
  return useQuery({
    queryKey: ["admin-all-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_tenants")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200); // Limit for faster load
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

// Audit logs hook with limit - optimized
export const useAuditLogs = (limit = 50) => {
  return useQuery({
    queryKey: ["admin-audit-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("id, action, resource_type, resource_id, user_id, created_at")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

// Clickstream events hook with filters - heavily optimized
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
        .select("id, session_id, event_type, page_url, element_id, element_text, created_at, metadata")
        .order("created_at", { ascending: false })
        .limit(100); // Reduced from 500 for faster initial load

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
    staleTime: 30000, // 30 seconds cache
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 60000, // Reduced to 1 minute interval
    refetchOnWindowFocus: false,
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
