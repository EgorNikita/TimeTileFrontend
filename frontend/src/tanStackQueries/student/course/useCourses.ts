import { useInfiniteQuery } from "@tanstack/vue-query";
import type { CourseFilters, Course } from "@/types/course";
import { fetchCourses } from "@/services/courseService";
import { PagedList } from "@/common/types/pagedList";

export function useCourses(filters: CourseFilters = {}, pageSize = 20) {
  return useInfiniteQuery({
    queryKey: ["courses", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      try {
        return await fetchCourses({
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
