import { PagedList } from "@/common/types/pagedList";
import { createApi } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedListParams } from "@/types/common/PagedList";
import { TimetableUnit, TimetableUnitFilters } from "@/types/timetable";

const api = createApi();

export async function fetchTimetableUnits(
  params: PagedListParams<TimetableUnitFilters> = {},
): Promise<PagedList<TimetableUnit>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.TIMETABLE_UNITS}?${queryString}`
    : API_ENDPOINTS.TIMETABLE_UNITS;

  const response = await api.get(url);

  console.log("fetchTimetableUnits response:", response);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch timetable units");
  }

  const data: PagedList<TimetableUnit> = response.data;
  data.items = data.items.map(parseTimetableUnit);

  return data;
}

function parseTimetableUnit(unit: TimetableUnit): TimetableUnit {
  return {
    ...unit,
    startTime: new Date(unit.startTime),
    endTime: new Date(unit.endTime),
  };
}
