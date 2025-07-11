import { createApi } from "@/utils/apiClient"; // your axios or fetch wrapper
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";
import {
  StudentCourseInfo,
  StudentCourseFilters,
} from "@/types/studentCourseInfo";

const api = createApi();

export async function fetchStudentById(id: number) {
  return await api.get(`/students/${id}`);
}

export async function fetchStudentCoursesInfo(
  studentId: number | string,
  params: PagedListParams<StudentCourseFilters> = {},
): Promise<PagedList<StudentCourseInfo>> {
  console.log("Fetching student courses info", studentId, params);

  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.STUDENTS.COURSES(studentId)}?${queryString}`
    : API_ENDPOINTS.STUDENTS.COURSES(studentId);

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch courses");
  }

  // Transform icon URLs:
  const transformedCourses: StudentCourseInfo[] = response.data.items.map(
    (courseStudent: StudentCourseInfo) => ({
      ...courseStudent,
      course: {
        ...courseStudent.course,
        iconUrl: `${API_BASE_URL}${API_ENDPOINTS.FILES}/${courseStudent.course.iconUrl}`,
      },
    }),
  );

  return {
    ...response.data,
    items: transformedCourses,
  };
}
