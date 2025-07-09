import { useInfiniteQuery } from "@tanstack/vue-query";
import { fetchTerms } from "@/services/termService";
import { PagedList } from "@/common/types/pagedList";
import { Term, TermFilters } from "@/types/term";

export function useTerms(filters: TermFilters = {}, pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ["terms", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      return fetchTerms({ ...filters, page: pageParam, pageSize });
    },

    getNextPageParam: (
      lastPage: PagedList<Term>,
      allPages: PagedList<Term>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
}
