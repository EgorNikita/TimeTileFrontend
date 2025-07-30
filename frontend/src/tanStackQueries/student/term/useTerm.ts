import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { Term, termApi, TermFilters } from "@/services/termApi";

export function useTerms(filters: TermFilters = {}, pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ["terms", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      return termApi.fetchTerms({ ...filters, page: pageParam, pageSize });
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
