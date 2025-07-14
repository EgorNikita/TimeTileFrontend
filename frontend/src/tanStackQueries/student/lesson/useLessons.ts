import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { Lesson, LessonFilters } from "@/types/lesson";
import { fetchLessons } from "@/services/lessonService";

export function useLessons(filters: LessonFilters = {}, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["lessons", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      return fetchLessons({ ...filters, page: pageParam, pageSize });
    },

    getNextPageParam: (
      lastPage: PagedList<Lesson>,
      allPages: PagedList<Lesson>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
}