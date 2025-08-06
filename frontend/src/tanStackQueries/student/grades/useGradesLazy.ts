import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { Grade, gradeApi, GradeFilters } from "@/services/gradeApi";

export function useGradesLazy(filters: GradeFilters = {}, pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ["grades", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      return await gradeApi.fetchGrades({
        ...filters,
        page: pageParam,
        pageSize,
      });
    },

    getNextPageParam: (
      lastPage: PagedList<Grade>,
      allPages: PagedList<Grade>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
}
