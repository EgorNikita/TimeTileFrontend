import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { fetchStudentCoursesInfo } from "@/services/studentService";
import {
  StudentCourseFilters,
  StudentCourseInfo,
} from "@/types/studentCourseInfo";

export function useStudentCourseInfo(
  studentId: number | string,
  filters: StudentCourseFilters = {},
  pageSize = 12,
) {
  return useInfiniteQuery({
    queryKey: ["studentCourseInfo", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      return fetchStudentCoursesInfo(studentId, {
        ...filters,
        page: pageParam,
        pageSize,
      });
    },

    getNextPageParam: (
      lastPage: PagedList<StudentCourseInfo>,
      allPages: PagedList<StudentCourseInfo>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
}
