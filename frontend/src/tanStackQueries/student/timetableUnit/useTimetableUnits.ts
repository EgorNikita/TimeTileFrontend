import { useQuery } from "@tanstack/vue-query";
import { timetableApi, TimetableUnitFilters } from "@/services/timetableApi";

export function useTimetableUnits(filters: TimetableUnitFilters = {}) {
  return useQuery({
    queryKey: ["timetableUnits", filters] as const,

    queryFn: async () => {
      const pagedTimetableUnits = await timetableApi.fetchTimetableUnits({
        ...filters,
        sortBy: "startTime",
      });
      return pagedTimetableUnits.items;
    },

    staleTime: 1000 * 60 * 15,
  });
}
