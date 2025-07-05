import { createApi } from "@/utils/apiClient.js";
import { success, failure } from "@/utils/resultPattern";

const COURSES_BASE_URL = "/courses";
const api = createApi();

/**
 * Helper function to build query parameters
 */
function buildQueryParams(params = {}) {
  const queryParams = new URLSearchParams();

  // Array parameters
  const arrayParams = [
    "subjectIds",
    "teacherIds",
    "termIds",
    "studentIds",
    "groupIds",
  ];
  arrayParams.forEach((param) => {
    if (params[param]?.length) {
      params[param].forEach((id) => queryParams.append(param, id));
    }
  });

  // Single value parameters
  const singleParams = ["page", "pageSize", "sortBy", "descending"];
  singleParams.forEach((param) => {
    if (params[param] !== undefined && params[param] !== null) {
      queryParams.append(param, params[param]);
    }
  });

  return queryParams.toString();
}

/**
 * Helper function to handle API responses consistently
 */
async function handleApiResponse(apiCall, errorMessage) {
  try {
    const response = await apiCall();

    if (response.data?.isSuccess) {
      return success(response.data.data);
    } else {
      return failure(response.data?.error || errorMessage);
    }
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error);
    return failure(
      error.response?.data?.error || error.message || errorMessage,
    );
  }
}

/**
 * Fetch courses by student ID
 */
export async function fetchCoursesByStudentId(studentId) {
  return handleApiResponse(
    () => api.get(`/students/${studentId}/courses`),
    "Failed to fetch courses by student ID",
  );
}

/**
 * Fetch courses with filtering and pagination
 */
export async function fetchCourses(params = {}) {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${COURSES_BASE_URL}?${queryString}`
    : COURSES_BASE_URL;

  return handleApiResponse(() => api.get(url), "Failed to fetch courses");
}

/**
 * Fetch student courses (alias for better naming consistency)
 */
export const fetchStudentCourses = fetchCourses;

/**
 * Fetch single course by ID
 */
export async function fetchCourseById(courseId) {
  return handleApiResponse(
    () => api.get(`${COURSES_BASE_URL}/${courseId}`),
    "Failed to fetch course",
  );
}

/**
 * Create a new course
 */
export async function createCourse(courseData) {
  return handleApiResponse(
    () => api.post(COURSES_BASE_URL, courseData),
    "Failed to create course",
  );
}

/**
 * Update course information
 */
export async function updateCourse(courseId, courseData) {
  return handleApiResponse(
    () => api.put(`${COURSES_BASE_URL}/${courseId}`, courseData),
    "Failed to update course",
  );
}

/**
 * Delete a course
 */
export async function deleteCourse(courseId) {
  return handleApiResponse(
    () => api.delete(`${COURSES_BASE_URL}/${courseId}`),
    "Failed to delete course",
  );
}

/**
 * Update course students
 */
export async function updateCourseStudents(courseId, studentsData) {
  return handleApiResponse(
    () => api.patch(`${COURSES_BASE_URL}/${courseId}/students`, studentsData),
    "Failed to update course students",
  );
}

/**
 * Add students to course
 */
export async function addStudentsToCourse(courseId, studentIds) {
  return handleApiResponse(
    () => api.post(`${COURSES_BASE_URL}/${courseId}/students`, { studentIds }),
    "Failed to add students to course",
  );
}

/**
 * Remove students from course
 */
export async function removeStudentsFromCourse(courseId, studentIds) {
  return handleApiResponse(
    () =>
      api.delete(`${COURSES_BASE_URL}/${courseId}/students`, {
        data: { studentIds },
      }),
    "Failed to remove students from course",
  );
}

/**
 * Get course enrollment statistics
 */
export async function getCourseStats(courseId) {
  return handleApiResponse(
    () => api.get(`${COURSES_BASE_URL}/${courseId}/stats`),
    "Failed to fetch course statistics",
  );
}

/**
 * Search courses by title or description
 */
export async function searchCourses(query, params = {}) {
  const searchParams = {
    ...params,
    search: query,
  };

  return fetchCourses(searchParams);
}

// Export all functions as a single object for easier importing
export const courseApi = {
  fetchCoursesByStudentId,
  fetchCourses,
  fetchStudentCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  updateCourseStudents,
  addStudentsToCourse,
  removeStudentsFromCourse,
  getCourseStats,
  searchCourses,
};

// Default export for convenience
export default courseApi;
