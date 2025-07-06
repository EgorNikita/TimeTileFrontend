import { PagedList } from "@/common/types/pagedList";
import { Grade, GradeListParams } from "@/types/grade";
import { createApi } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";

const api = createApi();

export async function fetchGrades(
  params: GradeListParams = {},
): Promise<PagedList<Grade>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.GRADES}?${queryString}`
    : API_ENDPOINTS.GRADES;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch courses");
  }

  return response.data;
}
