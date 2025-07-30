import { ComputedRef, Ref, unref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { gradeApi } from "@/services/gradeApi";

export const useGradeByIdQuery = (
  gradeId: ComputedRef<number> | Ref<number> | number,
) => {
  return useQuery({
    queryKey: ["gradeById", gradeId],

    queryFn: async () => {
      const gradeIdValue = unref(gradeId);
      return await gradeApi.fetchGradeById(gradeIdValue);
    },
  });
};
