import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { Course, courseApi, CourseFilters } from "@/services/courseApi";

export function useCourses(filters: CourseFilters = {}, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["courses", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      try {
        return await courseApi.fetchCourses({
          ...filters,
          page: pageParam,
          pageSize,
        });
      } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }
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
