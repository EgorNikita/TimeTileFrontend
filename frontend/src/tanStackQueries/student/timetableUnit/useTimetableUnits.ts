import { useQuery } from "@tanstack/vue-query";
import { TimetableUnitFilters } from "@/types/timetable";
import { fetchTimetableUnits } from "@/services/timetableService";

export function useTimetableUnits(filters: TimetableUnitFilters = {}) {
  return useQuery({
    queryKey: ["timetableUnits", filters] as const,

    queryFn: async () => {
      const pagedTimetableUnits = await fetchTimetableUnits({
        ...filters,
        sortBy: "startTime",
      });
      return pagedTimetableUnits.items;
    },

    staleTime: 1000 * 60 * 15,
  });
}
