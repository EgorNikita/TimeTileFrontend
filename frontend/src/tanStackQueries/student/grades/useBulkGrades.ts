import { ComputedRef, Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { gradeApi } from "@/services/gradeApi";

export const useBulkGradesQuery = (
  ids: ComputedRef<number[]> | Ref<number[]> | number[],
  enabled: ComputedRef<boolean> | Ref<boolean> | boolean = true,
) => {
  return useQuery({
    queryKey: ["bulk-grades", ids],

    queryFn: async () => {
      const idsValue = Array.isArray(ids) ? ids : ids.value;
      return await gradeApi.fetchGradesByIds(idsValue);
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
