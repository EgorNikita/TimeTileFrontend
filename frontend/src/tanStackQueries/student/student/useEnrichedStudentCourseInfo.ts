import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { fetchStudentCoursesInfo } from "@/services/studentService";
import {
  EnrichedStudentCourseInfo,
  StudentCourseFilters,
  StudentCourseInfo,
} from "@/types/studentCourseInfo";
import { fetchSubjectsByIds } from "@/services/subjectService";
import { fetchGradesByIds } from "@/services/gradeService";

export function useEnrichedStudentCourseInfo(
  studentId: number | string,
  filters: StudentCourseFilters = {},
  pageSize = 9,
) {
  return useInfiniteQuery({
    queryKey: ["useEnrichedStudentCourseInfo", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      const coursePage = await fetchStudentCoursesInfo(studentId, {
        ...filters,
        page: pageParam,
        pageSize,
      });

      console.log("coursePage", coursePage);

      const subjectIds = coursePage.items.map((c) => c.course.subjectId);
      const gradeIds = coursePage.items
        .filter((studentToCourse) => studentToCourse.examGradeId != null)
        .map((studentToCourse) => studentToCourse.examGradeId!);

      const subjects =
        subjectIds.length > 0 ? await fetchSubjectsByIds(subjectIds) : [];
      const grades =
        gradeIds.length > 0 ? await fetchGradesByIds(gradeIds) : [];

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
          termMark: gradeMap.get(courseStudent.examGradeId!) ?? null,
        }),
      );

      console.log("enrichedCourses", enrichedCourses);

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
