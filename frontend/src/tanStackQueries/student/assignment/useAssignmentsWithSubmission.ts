import {
  EnrichedStudentCourseInfo,
  StudentCourseFilters,
  StudentCourseInfo,
} from "@/types/studentCourseInfo";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { fetchSubjectsByIds } from "@/services/subjectService";
import { fetchGradesByIds } from "@/services/gradeService";
import { PagedList } from "@/common/types/pagedList";
import { AssignmentFilters, SubmissionFilters } from "@/types/assignment";
import {
  fetchAssignments,
  fetchSubmissions,
} from "@/services/assignmentService";

export function useAssignmentsWithSubmission(
  filters: SubmissionFilters = {},
  pageSize = 15,
) {
  return useInfiniteQuery({
    queryKey: ["useAssignmentsWithSubmission", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      const submisssionPage = await fetchSubmissions({
        ...filters,
        page: pageParam,
        pageSize,
      });

      const assignmentIds = submisssionPage.items.map((s) => s.assignmentId);

      const assignments = console.log("coursePage", coursePage);

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
