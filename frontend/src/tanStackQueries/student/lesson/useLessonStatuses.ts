import { TimetableUnitFilters } from "@/types/timetable";
import { useQuery } from "@tanstack/vue-query";
import { fetchLessonStatuses } from "@/services/lessonService";

export function useLessonStatuses(filters: TimetableUnitFilters = {}) {
  return useQuery({
    queryKey: ["lessonStatuses", filters] as const,

    queryFn: async () => {
      const pagedTimetableUnits = await fetchLessonStatuses({
        ...filters,
        pageSize: 100,
      });
      return pagedTimetableUnits.items;
    },

    staleTime: 1000 * 60 * 30,
  });
}
