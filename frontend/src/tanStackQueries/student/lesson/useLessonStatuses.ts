import { useQuery } from "@tanstack/vue-query";
import { fetchLessonStatuses } from "@/services/lessonService";
import { LessonStatusFilters } from "@/types/lesson";

export function useLessonStatuses(filters: LessonStatusFilters = {}) {
  return useQuery({
    queryKey: ["lessonStatuses", filters] as const,

    queryFn: async () => {
      return await fetchLessonStatuses({
        ...filters,
      });
    },

    staleTime: 1000 * 60 * 30,
  });
}
