import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 25;

interface UseInfiniteUsersOptions {
  searchQuery?: string;
  roleFilter?: string;
}

export const useInfiniteUsers = ({
  searchQuery = "",
  roleFilter = "all",
}: UseInfiniteUsersOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["users-infinite", searchQuery, roleFilter],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1);

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,company_name.ilike.%${searchQuery}%`);
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

export const useUserRoles = () => {
  return useQuery({
    queryKey: ["user-roles-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (error) throw error;
      
      const rolesMap: Record<string, string> = {};
      data?.forEach((r) => {
        rolesMap[r.user_id] = r.role;
      });
      return rolesMap;
    },
    staleTime: 60000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const flattenUsersPages = (data: { pages: { data: any[] }[] } | undefined) => {
  if (!data?.pages) return [];
  return data.pages.flatMap(page => page.data);
};
