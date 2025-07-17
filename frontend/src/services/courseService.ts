import { createApi } from "@/utils/apiClient"; // your axios or fetch wrapper
import type { Course, CourseFilters } from "@/types/course";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";
import { transformIconUrls } from "@/services/common/serviceUtils";

const api = createApi();

export async function fetchCourses(
  params: PagedListParams<CourseFilters> = {},
): Promise<PagedList<Course>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.COURSES.DEFAULT}?${queryString}`
    : API_ENDPOINTS.COURSES.DEFAULT;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch courses");
  }

  return {
    ...response.data,
    items: transformIconUrls(response.data),
  };
}

export async function fetchCoursesByIds(ids: number[]): Promise<Course[]> {
  if (ids.length === 0) return [];

  const query = ids.map((id) => `ids=${id}`).join("&");
  const url = `${API_ENDPOINTS.COURSES.BY_IDS}?${query}`;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch courses");
  }

  return transformIconUrls(response.data);
}
