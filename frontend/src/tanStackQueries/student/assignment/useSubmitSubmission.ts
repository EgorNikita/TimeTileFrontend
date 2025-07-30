import { useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  assignmentApi,
  SubmitSubmissionPayload,
} from "@/services/assignmentApi";

export function useSubmitSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitSubmissionPayload) =>
      assignmentApi.submitSubmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (error: unknown) => {
      console.error("Submission failed:", error);
      // show toast or set error state
    },
  });
}
