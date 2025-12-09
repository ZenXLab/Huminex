import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 25;

interface UseInfiniteQuotesOptions {
  statusFilter?: string;
  searchQuery?: string;
}

export const useInfiniteQuotes = ({
  statusFilter = "all",
  searchQuery = "",
}: UseInfiniteQuotesOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["quotes-infinite", statusFilter, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "approved" | "converted" | "draft" | "pending" | "rejected");
      }

      if (searchQuery) {
        query = query.or(`quote_number.ilike.%${searchQuery}%,contact_name.ilike.%${searchQuery}%,contact_email.ilike.%${searchQuery}%`);
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
    staleTime: 60000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const flattenQuotesPages = (data: { pages: { data: any[] }[] } | undefined) => {
  if (!data?.pages) return [];
  return data.pages.flatMap(page => page.data);
};
