import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import {
  studentApi,
  StudentCourseFilters,
  StudentCourseInfo,
} from "@/services/studentApi";
import { EnrichedStudentCourseInfo } from "@/types/studentCourseInfo";
import { subjectApi } from "@/services/subjectApi";
import { gradeApi } from "@/services/gradeApi";

export function useEnrichedStudentCourseInfo(
  studentId: number | string,
  filters: StudentCourseFilters = {},
  pageSize = 9,
) {
  return useInfiniteQuery({
    queryKey: ["useEnrichedStudentCourseInfo", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      const coursePage = await studentApi.fetchStudentCoursesInfo(studentId, {
        ...filters,
        page: pageParam,
        pageSize,
      });

      const subjectIds = coursePage.items.map((c) => c.course.subjectId);
      const gradeIds = coursePage.items
        .filter((studentToCourse) => studentToCourse.gradeId != null)
        .map((studentToCourse) => studentToCourse.gradeId!);

      const subjects =
        subjectIds.length > 0
          ? await subjectApi.fetchSubjectsByIds(subjectIds)
          : [];
      const grades =
        gradeIds.length > 0 ? await gradeApi.fetchGradesByIds(gradeIds) : [];

      const subjectMap = new Map<number, string>();
      for (const subject of subjects) {
        subjectMap.set(subject.id, subject.title);
      }

      const gradeMap = new Map<number, number>();
      for (const grade of grades) {
        gradeMap.set(grade.id, grade.value);
      }

      const enrichedCourses: EnrichedStudentCourseInfo[] = coursePage.items.map(
        (courseStudent: StudentCourseInfo) => ({
          ...courseStudent,
          subjectTitle: subjectMap.get(courseStudent.course.subjectId) ?? "",
          termMark: gradeMap.get(courseStudent.gradeId!) ?? null,
        }),
      );

      return {
        items: enrichedCourses,
        page: coursePage.page,
        pageSize: coursePage.pageSize,
        totalCount: coursePage.totalCount,
        totalPages: coursePage.totalPages,
      };
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
