import { createApi } from "@/utils/apiClient";
import type { ResultPattern } from "@/utils/resultPattern";
import { success, failure } from "@/utils/resultPattern";
import { CourseDto } from "@/types/course";

const api = createApi();

export interface PagedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PagedCourseResult
  extends ResultPattern<PagedList<CourseDto>> {}
export interface CourseResult extends ResultPattern<CourseDto> {}

export interface GetCoursesParams {
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
}

// Helper to serialize array query params (subjectIds=1&subjectIds=2)
function buildQueryParams(params: GetCoursesParams): string {
  const query = new URLSearchParams();

  ["subjectIds", "teacherIds", "termIds", "studentIds", "groupIds"].forEach(
    (key) => {
      const value = params[key as keyof GetCoursesParams];
      if (Array.isArray(value)) {
        value.forEach((v) => query.append(key, String(v)));
      }
    },
  );

  ["page", "pageSize", "sortBy", "descending"].forEach((key) => {
    const value = params[key as keyof GetCoursesParams];
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  return query.toString();
}

export async function fetchCourses(
  params: GetCoursesParams = {},
): Promise<PagedCourseResult> {
  try {
    const queryString = buildQueryParams(params);
    const url = queryString ? `/courses?${queryString}` : "/courses";
    const response = await api.get(url);

    // The interceptor will handle success/failure wrapping, but just in case:
    if (response && response.isSuccess) {
      console.log("Fetched courses:", response.data);
      const transformedCourses = response.data.items.map(
        (course: CourseDto) => ({
          ...course,
          iconUrl: `http://localhost:5282/files/${course.iconUrl}`,
        }),
      );

      const proceedData = {
        ...response.data,
        items: transformedCourses,
      };

      return success(proceedData);
    } else if (response && response.isFailure) {
      return failure(response.error);
    } else {
      return failure({ message: "Unexpected API response" });
    }
  } catch (error) {
    return failure({ message: (error as Error).message });
  }
}

export async function fetchCourseById(id: number): Promise<CourseResult> {
  try {
    const response = await api.get(`/courses/${id}`);

    if (response && response.isSuccess) {
      return success(response.data);
    } else if (response && response.isFailure) {
      return failure(response.error);
    } else {
      return failure({ message: "Unexpected API response" });
    }
  } catch (error) {
    return failure({ message: (error as Error).message });
  }
}
