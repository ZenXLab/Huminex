import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useCallback, useMemo } from "react";

// Centralized admin data hooks with caching and optimization

// Cache times
const STALE_TIME = 30 * 1000; // 30 seconds
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

// Stats hook for dashboard overview
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Parallel fetch all stats for better performance
      const [
        { count: quotesCount },
        { data: pendingQuotes },
        { count: invoicesCount },
        { data: paidInvoices },
        { count: usersCount },
        { count: inquiriesCount },
        { data: pendingOnboardings },
        { count: activeTenantsCount },
      ] = await Promise.all([
        supabase.from("quotes").select("*", { count: "exact", head: true }),
        supabase.from("quotes").select("id").eq("status", "pending"),
        supabase.from("invoices").select("*", { count: "exact", head: true }),
        supabase.from("invoices").select("total_amount").eq("status", "paid"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("*", { count: "exact", head: true }),
        supabase.from("onboarding_sessions").select("id").in("status", ["new", "pending", "pending_approval", "verified"]),
        supabase.from("client_tenants").select("*", { count: "exact", head: true }).eq("status", "active"),
      ]);

      const totalRevenue = paidInvoices?.reduce((sum, i) => sum + Number(i.total_amount || 0), 0) || 0;

      return {
        totalQuotes: quotesCount || 0,
        pendingQuotes: pendingQuotes?.length || 0,
        totalInvoices: invoicesCount || 0,
        totalRevenue,
        totalUsers: usersCount || 0,
        totalInquiries: inquiriesCount || 0,
        pendingOnboarding: pendingOnboardings?.length || 0,
        activeTenants: activeTenantsCount || 0,
      };
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

// Recent quotes hook
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
  });
};

// All quotes hook with pagination
export const useAllQuotes = () => {
  return useQuery({
    queryKey: ["admin-all-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

// Pending onboardings hook
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
  });
};

// Recent tenants hook
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
  });
};

// All tenants hook
export const useAllTenants = () => {
  return useQuery({
    queryKey: ["admin-all-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_tenants")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

// Audit logs hook with limit
export const useAuditLogs = (limit = 100) => {
  return useQuery({
    queryKey: ["admin-audit-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

// Clickstream events hook with filters
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
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

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
    staleTime: 5000, // Clickstream needs faster refresh
    gcTime: 60 * 1000,
    refetchInterval: 10000, // Reduced from 5s to 10s
  });
};

// Real-time subscription hook for admin dashboard
export const useAdminRealtime = (tables: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channels = tables.map((table) => {
      return supabase
        .channel(`admin-${table}-changes`)
        .on("postgres_changes", { event: "*", schema: "public", table }, () => {
          // Debounce invalidation to prevent rapid re-renders
          const timeoutId = setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
            queryClient.invalidateQueries({ queryKey: [`admin-${table}`] });
          }, 500);
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
