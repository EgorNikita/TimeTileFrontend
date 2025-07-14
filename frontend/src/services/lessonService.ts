import { createApi } from "@/utils/apiClient";
import { PagedListParams } from "@/types/common/PagedList";
import { PagedList } from "@/common/types/pagedList";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { Lesson, LessonFilters } from "@/types/lesson";

const api = createApi();

export async function fetchLessons(
  params: PagedListParams<LessonFilters> = {},
): Promise<PagedList<Lesson>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.LESSONS}?${queryString}`
    : API_ENDPOINTS.LESSONS;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch lessons");
  }

  return response.data;
}