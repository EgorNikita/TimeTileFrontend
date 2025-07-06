import { useQuery } from "@tanstack/vue-query";
import { ComputedRef, Ref } from "vue";
import { fetchBulkSubjects } from "@/services/subjectService";

export const useBulkSubjectsQuery = (
  ids: ComputedRef<number[]> | Ref<number[]> | number[],
  enabled: ComputedRef<boolean> | Ref<boolean> | boolean = true,
) => {
  return useQuery({
    queryKey: ["bulk-subjects", ids],

    queryFn: async () => {
      const idsValue = Array.isArray(ids) ? ids : ids.value;
      return await fetchBulkSubjects(idsValue);
    },

    // staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
