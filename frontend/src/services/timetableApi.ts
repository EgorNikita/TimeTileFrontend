import { PagedList } from "@/common/types/pagedList";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedListParams } from "@/types/common/PagedList";
import { normalizeHistoricalTime } from "@/helpers/dateHelpers";
import { api } from "@/utils/apiClient";

export interface TimetableUnit {
  id: string | number;
  title: string;
  startTime: Date;
  endTime: Date;
}

export interface TimetableUnitFilters {
  fetchAll?: boolean;
}

export const timetableApi = {
  async fetchTimetableUnits(
    params: PagedListParams<TimetableUnitFilters> = {},
  ): Promise<PagedList<TimetableUnit>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.TIMETABLE_UNITS}?${queryString}`
      : API_ENDPOINTS.TIMETABLE_UNITS;

    const response = await api.get<PagedList<TimetableUnit>>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch timetable units:" + response.error);
    }

    return {
      ...response.data,
      items: response.data.items.map(parseTimetableUnit),
    };
  },
};

function parseTimetableUnit(unit: TimetableUnit): TimetableUnit {
  return {
    ...unit,
    startTime: normalizeHistoricalTime(unit.startTime),
    endTime: normalizeHistoricalTime(unit.endTime),
  };
}
