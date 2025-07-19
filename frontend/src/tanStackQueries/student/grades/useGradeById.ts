import { ComputedRef, Ref, unref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { fetchGradeById } from "@/services/gradeService";

export const useGradeByIdQuery = (
  gradeId: ComputedRef<number> | Ref<number> | number,
) => {
  return useQuery({
    queryKey: ["gradeById", gradeId],

    queryFn: async () => {
      const gradeIdValue = unref(gradeId);
      return await fetchGradeById(gradeIdValue);
    },
  });
};
