import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { fetchStudentLessonsInfo } from "@/services/studentService";
import { StudentLessonFilters, StudentLessonInfo } from "@/types/studentLessonsInfo";

export function useStudentLessonInfo(
  studentId: number | string,
  filters: StudentLessonFilters = {},
  pageSize = 12,
) {
  return useInfiniteQuery({
    queryKey: ["studentLessonInfo", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      return fetchStudentLessonsInfo(studentId, {
        ...filters,
        page: pageParam,
        pageSize,
      });
    },

    getNextPageParam: (
      lastPage: PagedList<StudentLessonInfo>,
      allPages: PagedList<StudentLessonInfo>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
}
