import { ComputedRef, Ref, unref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { assignmentApi } from "@/services/assignmentApi";

export const useAssignmentFiles = (
  id: ComputedRef<number> | Ref<number> | number,
) => {
  return useQuery({
    queryKey: ["assigment-files", id],

    queryFn: () => {
      const idValue = unref(id);
      return assignmentApi.fetchAssignmentFiles(idValue);
    },

    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
