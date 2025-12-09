import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 50;

interface UseInfiniteClickstreamOptions {
  eventFilter?: string;
  timeRange?: string;
  customDateRange?: { from: Date; to: Date } | null;
}

export const useInfiniteClickstream = ({
  eventFilter = "all",
  timeRange = "24h",
  customDateRange = null,
}: UseInfiniteClickstreamOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["clickstream-events-infinite", eventFilter, timeRange, customDateRange?.from?.toISOString(), customDateRange?.to?.toISOString()],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("clickstream_events")
        .select("id, session_id, event_type, page_url, element_id, element_text, created_at, metadata")
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

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
      
      return {
        data: data || [],
        nextPage: data && data.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 30000,
    gcTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const flattenClickstreamPages = (data: { pages: { data: any[] }[] } | undefined) => {
  if (!data?.pages) return [];
  return data.pages.flatMap(page => page.data);
};
