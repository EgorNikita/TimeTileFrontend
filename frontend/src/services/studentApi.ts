import { PagedList } from "@/common/types/pagedList";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedListParams } from "@/types/common/PagedList";
import { api } from "@/utils/apiClient";
import { Course } from "@/services/courseApi";
import { transformIconUrls } from "@/services/common/serviceUtils";
import { Lesson } from "@/services/lessonApi";

export interface StudentCourseInfo {
  courseId: number;
  course: Course;
  examGradeId: number | null;
  hasExam: boolean;
  positionX: number;
  positionY: number;
  averageGrade: number;
}

export interface StudentCourseFilters {
  termIds?: number[];
  CourseId?: number;
  ExamGradeId?: number | null;
  HasExam?: boolean;
  PositionX?: number;
  PositionY?: number;
}

export interface BaseStudentLessonInfo {
  lessonId: number;
  cameAt?: string;
  leftAt?: string;
  gradeId?: number;
}

export interface StudentLessonInfo extends BaseStudentLessonInfo {
  lesson: Lesson;
}

export interface StudentLessonFilters {
  courseIds?: number[];
  from?: string;
  until?: string;
}

export interface StudentAttendanceCountInfo {
  totalLessons: number;
  attendedLessons: number;
}

export interface StudentAttendanceCountFilters {
  courseIds?: number[];
}

export const studentApi = {
  async fetchStudentById(id: number) {
    const url = `${API_ENDPOINTS.STUDENTS.DEFAULT}/${id}`;
    const response = await api.get(url);

    if (!response.isSuccess || !response.data) {
      throw Error(`Failed to fetch student with ID: ${id}` + response.error);
    }

    return response.data;
  },

  async fetchStudentCoursesInfo(
    studentId: number | string,
    params: PagedListParams<StudentCourseFilters> = {},
  ): Promise<PagedList<StudentCourseInfo>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.STUDENTS.COURSES(studentId)}?${queryString}`
      : API_ENDPOINTS.STUDENTS.COURSES(studentId);

    const response = await api.get<PagedList<StudentCourseInfo>>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch student courses info:" + response.error);
    }

    const transformedCourses = transformIconUrls(
      response.data.items.map((item) => item.course),
    );

    const updatedItems = response.data.items.map((item, index) => ({
      ...item,
      course: transformedCourses[index],
    }));

    return {
      ...response.data,
      items: updatedItems,
    };
  },

  async fetchStudentLessonsInfo(
    studentId: number | string,
    params: PagedListParams<StudentLessonFilters> = {},
  ): Promise<PagedList<StudentLessonInfo>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.STUDENTS.LESSONS(studentId)}?${queryString}`
      : API_ENDPOINTS.STUDENTS.LESSONS(studentId);

    const response = await api.get<PagedList<StudentLessonInfo>>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch student lessons info:" + response.error);
    }

    return response.data;
  },

  async fetchStudentAttendanceCount(
    studentId: number | string,
    params: StudentAttendanceCountFilters = {},
  ): Promise<StudentAttendanceCountInfo> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.STUDENTS.ATTENDANCE_COUNT(studentId)}?${queryString}`
      : API_ENDPOINTS.STUDENTS.ATTENDANCE_COUNT(studentId);

    const response = await api.get<StudentAttendanceCountInfo>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch student attendance count:" + response.error);
    }

    return response.data;
  },
};
