import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { SubmitSubmissionPayload } from "@/types/assignment";
import { submitSubmission } from "@/services/assignmentService";

export function useSubmitSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitSubmissionPayload) => submitSubmission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (error: unknown) => {
      console.error("Submission failed:", error);
      // show toast or set error state
    },
  });
}
