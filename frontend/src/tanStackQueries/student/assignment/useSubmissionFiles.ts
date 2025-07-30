import { ComputedRef, Ref, unref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { assignmentApi } from "@/services/assignmentApi";

export const useSubmissionFiles = (
  id: ComputedRef<number> | Ref<number> | number,
) => {
  return useQuery({
    queryKey: ["submission-files", id],

    queryFn: async () => {
      const idValue = unref(id);
      const fileUrls = await assignmentApi.fetchSubmissionFiles(idValue);
      console.log("fileUrls", fileUrls);
      return fileUrls;
    },

    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
