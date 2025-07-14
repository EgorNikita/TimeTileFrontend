import { createApi } from "@/utils/apiClient"; // your axios or fetch wrapper
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";
import {
  StudentCourseInfo,
  StudentCourseFilters,
} from "@/types/studentCourseInfo";
import {
  StudentAttendanceCountFilters,
  StudentAttendanceCountInfo,
  StudentLessonFilters,
  StudentLessonInfo
} from "@/types/studentLessonsInfo";

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

export async function fetchStudentLessonsInfo(
  studentId: number | string,
  params: PagedListParams<StudentLessonFilters> = {},
): Promise<PagedList<StudentLessonInfo>> {
  console.log("Fetching student lessons info", studentId, params);

  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.STUDENTS.LESSONS(studentId)}?${queryString}`
    : API_ENDPOINTS.STUDENTS.LESSONS(studentId);

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch lessons");
  }

  return response.data;
}

export async function fetchStudentAttendanceCount(
  studentId: number | string,
  params: StudentAttendanceCountFilters = {}
): Promise<StudentAttendanceCountInfo> {
  console.log("Fetching student attendance count", studentId, params);

  const queryString = buildQueryParams(params);
  const url = queryString
      ? `${API_ENDPOINTS.STUDENTS.ATTENDANCE_COUNT(studentId)}?${queryString}`
      : API_ENDPOINTS.STUDENTS.ATTENDANCE_COUNT(studentId);

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch attendance count of the student");
  }

  return response.data;
}
