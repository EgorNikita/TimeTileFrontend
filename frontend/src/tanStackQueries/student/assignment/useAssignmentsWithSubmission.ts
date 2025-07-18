import { useInfiniteQuery } from "@tanstack/vue-query";
import {
  BasicAssignmentWithSubmission,
  SubmissionFilters,
} from "@/types/assignment";
import {
  fetchAssignmentByIds,
  fetchSubmissions,
} from "@/services/assignmentService";
import { ComputedRef, unref } from "vue";
import { PagedList } from "@/common/types/pagedList";

export function useAssignmentsWithSubmission(
  filters: SubmissionFilters | ComputedRef<SubmissionFilters> = {},
  pageSize = 15,
) {
  return useInfiniteQuery({
    queryKey: ["useAssignmentsWithSubmission", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      const filtersValue = unref(filters);

      const submissionPage = await fetchSubmissions({
        ...filtersValue,
        descending: true,
        page: pageParam,
        pageSize,
      });

      const assignmentIds = submissionPage.items.map((s) => s.assignmentId);
      const assignments = await fetchAssignmentByIds(assignmentIds);

      const assignmentsWithSubmission: BasicAssignmentWithSubmission[] =
        submissionPage.items.map((submission) => {
          const assignment = assignments.find(
            (a) => a.id === submission.assignmentId,
          );

          if (!assignment) {
            throw new Error(
              `Assignment with ID ${submission.assignmentId} not found`,
            );
          }
          return {
            assignment,
            submission,
          };
        });

      return {
        items: assignmentsWithSubmission,
        page: submissionPage.page,
        pageSize: submissionPage.pageSize,
        totalCount: submissionPage.totalCount,
        totalPages: submissionPage.totalPages,
      } as PagedList<BasicAssignmentWithSubmission>;
    },

    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    initialPageParam: 1,

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
