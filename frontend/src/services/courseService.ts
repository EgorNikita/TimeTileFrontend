import { createApi } from "@/utils/apiClient"; // your axios or fetch wrapper
import type { CourseListParams, PagedList, Course } from "@/types/course";

const api = createApi();

export async function fetchCourses(
  params: CourseListParams = {},
): Promise<PagedList<Course>> {
  const queryString = buildQueryParams(params);
  const url = queryString ? `/courses?${queryString}` : "/courses";

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

// Helper to build query params string (you may already have this)
function buildQueryParams(params: Record<string, any>): string {
  return Object.entries(params)
    .filter(([_, v]) => v != null && v !== "")
    .map(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&")
        : `${key}=${encodeURIComponent(value)}`,
    )
    .join("&");
}
