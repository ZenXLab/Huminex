import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 25;

interface UseInfiniteInvoicesOptions {
  statusFilter?: string;
  searchQuery?: string;
}

export const useInfiniteInvoices = ({
  statusFilter = "all",
  searchQuery = "",
}: UseInfiniteInvoicesOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["invoices-infinite", statusFilter, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("invoices")
        .select("*, quotes(quote_number, contact_name, contact_email)")
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as "cancelled" | "draft" | "overdue" | "paid" | "sent");
      }

      const { data, error } = await query;
      if (error) throw error;

      // Apply search filter client-side for joined data
      let filtered = data || [];
      if (searchQuery) {
        const search = searchQuery.toLowerCase();
        filtered = filtered.filter(inv => 
          inv.invoice_number?.toLowerCase().includes(search) ||
          inv.quotes?.contact_name?.toLowerCase().includes(search) ||
          inv.quotes?.contact_email?.toLowerCase().includes(search)
        );
      }
      
      return {
        data: filtered,
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

export const flattenInvoicesPages = (data: { pages: { data: any[] }[] } | undefined) => {
  if (!data?.pages) return [];
  return data.pages.flatMap(page => page.data);
};
