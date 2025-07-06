import { useInfiniteQuery } from "@tanstack/vue-query";
import type { CourseFilters, PagedList, Course } from "@/types/course";
import { fetchCourses } from "@/services/courseService";

export function useCourses(filters: CourseFilters = {}, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["courses", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      return fetchCourses({ ...filters, page: pageParam, pageSize });
    },

    getNextPageParam: (
      lastPage: PagedList<Course>,
      allPages: PagedList<Course>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
}
