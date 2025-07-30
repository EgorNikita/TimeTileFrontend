import { useInfiniteQuery } from "@tanstack/vue-query";
import { PagedList } from "@/common/types/pagedList";
import { studentApi, StudentLessonFilters } from "@/services/studentApi";
import { Grade, gradeApi, GradeType } from "@/services/gradeApi";
import { StudentLessonInfoWithGrades } from "@/types/studentLessonsInfo";

export function useStudentLessonInfoWithGrades(
  studentId: number | string,
  filters: StudentLessonFilters = {},
  pageSize = 6,
) {
  return useInfiniteQuery({
    queryKey: ["studentLessonInfoWithGrades", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      const lessonPage = await studentApi.fetchStudentLessonsInfo(studentId, {
        ...filters,
        page: pageParam,
        pageSize,
      });

      const lessonIds = lessonPage.items.map((l) => l.lessonId);

      const gradesPaged =
        lessonIds.length > 0
          ? await gradeApi.fetchGrades({
              entity: { lessonIds },
              pageSize: lessonIds.length * 2,
            })
          : { items: [] };

      const gradeMap = new Map<number, Grade[]>();
      for (const grade of gradesPaged.items) {
        const list = gradeMap.get(grade.lessonId!) ?? [];
        list.push(grade);
        gradeMap.set(grade.lessonId!, list);
      }

      const enrichedLessons: StudentLessonInfoWithGrades[] =
        lessonPage.items.map((lesson) => {
          const grades = gradeMap.get(lesson.lessonId) ?? [];

          const homeworkGrade = grades.find(
            (g) => g.type == GradeType.Homework,
          );
          const classworkGrade = grades.find(
            (g) => g.type == GradeType.Classwork,
          );

          return {
            ...lesson,
            homeworkGrade: homeworkGrade,
            classworkGrade: classworkGrade,
          };
        });

      return {
        items: enrichedLessons,
        page: lessonPage.page,
        pageSize: lessonPage.pageSize,
        totalCount: lessonPage.totalCount,
        totalPages: lessonPage.totalPages,
      };
    },

    getNextPageParam: (
      lastPage: PagedList<StudentLessonInfoWithGrades>,
      allPages: PagedList<StudentLessonInfoWithGrades>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 5,
    initialPageParam: 1,
  });
}
