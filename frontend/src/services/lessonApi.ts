import { api } from "@/utils/apiClient";
import { PagedListParams } from "@/types/common/PagedList";
import { PagedList } from "@/common/types/pagedList";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";

export interface LessonFilters {
  studentIds?: number[];
  groupIds?: number[];
  classroomIds?: number[];
  timetableUnitIds?: number[];
  courseIds?: number[];
  lessonStatusIds?: number[];
  from?: string;
  until?: string;
}

export interface Lesson {
  id: string | number;
  courseId: number;
  subjectId: number;
  teacherId: number;
  classroomId: number;
  lessonStatusId: number;
  timetableUnitIds: (string | number)[];
  date: Date;
  description?: string;
  assigmentId?: string;

  bgColor?: string;
  titleColor?: string;
}

export interface LessonStatusFilters {}

export interface LessonStatus {
  id: number;
  description: string;
}
export const lessonApi = {
  async fetchLessons(
    params: PagedListParams<LessonFilters> = {},
  ): Promise<PagedList<Lesson>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.LESSONS}?${queryString}`
      : API_ENDPOINTS.LESSONS;

    const response = await api.get<PagedList<Lesson>>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch lessons:" + response.error);
    }
    return response.data;
  },

  async fetchLessonStatuses(
    params: LessonStatusFilters = {},
  ): Promise<Array<LessonStatus>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.LESSON_STATUSES}?${queryString}`
      : API_ENDPOINTS.LESSON_STATUSES;

    const response = await api.get<LessonStatus[]>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch lesson-statuses:" + response.error);
    }

    return response.data;
  },
};
