import { createApi } from "@/utils/apiClient"; // your axios or fetch wrapper
import type { Course, CourseFilters } from "@/types/course";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";

const api = createApi();

export async function fetchCourses(
  params: PagedListParams<CourseFilters> = {},
): Promise<PagedList<Course>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.COURSES}?${queryString}`
    : API_ENDPOINTS.COURSES;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch courses");
  }

  // Transform icon URLs:
  const transformedCourses = response.data.items.map((course: Course) => ({
    ...course,
    iconUrl: `http://localhost:5282/files/${course.iconUrl}`,
  }));

  return {
    ...response.data,
    items: transformedCourses,
  };
}
