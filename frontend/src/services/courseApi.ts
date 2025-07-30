import { api } from "@/utils/apiClient"; // your axios or fetch wrapper
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";
import {
  EntityWithIcon,
  transformIconUrls,
} from "@/services/common/serviceUtils";

export interface Course extends EntityWithIcon {
  id: number;
  title: string;
  subjectId: number;
  teacherId: number;
  isAdvanced: boolean;
  termId: number;
}

export interface CourseFilters {
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
}

export const courseApi = {
  async fetchCourses(
    params: PagedListParams<CourseFilters> = {},
  ): Promise<PagedList<Course>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.COURSES.DEFAULT}?${queryString}`
      : API_ENDPOINTS.COURSES.DEFAULT;

    const response = await api.get<PagedList<Course>>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch courses:", response.error);
    }

    return {
      ...response.data!,
      items: transformIconUrls(response.data!.items),
    };
  },

  async fetchCoursesByIds(ids: number[]): Promise<Course[]> {
    if (ids.length === 0) return [];

    const query = ids.map((id) => `ids=${id}`).join("&");
    const url = `${API_ENDPOINTS.COURSES.BY_IDS}?${query}`;

    const response = await api.get<Course[]>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch courses:", response.error);
    }

    return transformIconUrls(response.data!);
  },
};
