import { PagedList } from "@/common/types/pagedList";
import { Grade, GradeFilters } from "@/types/grade";
import { createApi } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedListParams } from "@/types/common/PagedList";

const api = createApi();

export async function fetchGrades(
  params: PagedListParams<GradeFilters> = {},
): Promise<PagedList<Grade>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.GRADES.DEFAULT}?${queryString}`
    : API_ENDPOINTS.GRADES.DEFAULT;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch courses");
  }

  return response.data;
}

export async function fetchGradesByIds(ids: number[]): Promise<Grade[]> {
  if (ids.length === 0) return { value: [] };

  const query = ids.map((id) => `ids=${id}`).join("&");
  const url = `${API_ENDPOINTS.GRADES.BY_IDS}?${query}`;

  console.log("[fetchBulkGrades] Fetching:", url);
  const response = await api.get(url);
  console.log("[fetchBulkGrades] Response:", response.data);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch grades");
  }

  return response.data;
}
