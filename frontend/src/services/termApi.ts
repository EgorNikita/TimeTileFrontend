import { PagedList } from "@/common/types/pagedList";
import { api } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedListParams } from "@/types/common/PagedList";

export interface Term {
  id: number;
  title: number;
  startDate: string;
  endDate: string;
}

export interface TermFilters {
  studentIds?: number[];
  startDateUntil?: string;
}

export const termApi = {
  async fetchTerms(
    params: PagedListParams<TermFilters> = {},
  ): Promise<PagedList<Term>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.TERMS}?${queryString}`
      : API_ENDPOINTS.TERMS;

    const response = await api.get<PagedList<Term>>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch terms:" + response.error);
    }

    return response.data;
  },
};
