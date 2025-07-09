import { PagedList } from "@/common/types/pagedList";
import { createApi } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedListParams } from "@/types/common/PagedList";
import { Term, TermFilters } from "@/types/term";

const api = createApi();

export async function fetchTerms(
  params: PagedListParams<TermFilters> = {},
): Promise<PagedList<Term>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.TERMS}?${queryString}`
    : API_ENDPOINTS.TERMS;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch terms");
  }

  return response.data;
}
