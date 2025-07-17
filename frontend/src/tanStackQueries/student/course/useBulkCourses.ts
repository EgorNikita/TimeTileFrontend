import { useQuery } from "@tanstack/vue-query";
import { computed, ComputedRef, Ref, unref } from "vue";
import { fetchCoursesByIds } from "@/services/courseService";

export const useBulkCourses = (
  ids: ComputedRef<number[]> | Ref<number[]> | number[],
) => {
  const idsRef = computed(() => {
    const idsValue = unref(ids);
    return idsValue.filter((id) => id != null && id > 0);
  });

  return useQuery({
    queryKey: ["bulk-courses", ids],

    queryFn: () => {
      return fetchCoursesByIds(idsRef.value);
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
