import { useQuery } from "@tanstack/vue-query";
import { lessonApi, LessonStatusFilters } from "@/services/lessonApi";

export function useLessonStatuses(filters: LessonStatusFilters = {}) {
  return useQuery({
    queryKey: ["lessonStatuses", filters] as const,

    queryFn: async () => {
      return await lessonApi.fetchLessonStatuses({
        ...filters,
      });
    },

    staleTime: 1000 * 60 * 30,
  });
}
