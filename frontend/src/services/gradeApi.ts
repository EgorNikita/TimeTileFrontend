import { PagedList } from "@/common/types/pagedList";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedListParams } from "@/types/common/PagedList";
import { api } from "@/utils/apiClient";
import { Sortable } from "@/types/common/Sortable";

export interface Grade {
  id: number;
  value: number;
  weight: number;
  type: GradeType;
  date: string;
  subjectId: number;
  courseId: number;
  lessonId?: number;
}

export enum GradeType {
  Exam = "Exam",
  Classwork = "Classwork",
  Homework = "Homework",
}

export interface GradeFilters extends Sortable {
  coursesIds?: number[];
  studentIds?: number[];
  lessonIds?: number[];
}

export const gradeApi = {
  async fetchGrades(
    params: PagedListParams<GradeFilters> = {},
  ): Promise<PagedList<Grade>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.GRADES.DEFAULT}?${queryString}`
      : API_ENDPOINTS.GRADES.DEFAULT;

    const response = await api.get<PagedList<Grade>>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch grades:", response.error);
    }

    return response.data!;
  },

  async fetchGradesByIds(ids: number[]): Promise<Grade[]> {
    if (ids.length === 0) return [];

    const query = ids.map((id) => `ids=${id}`).join("&");
    const url = `${API_ENDPOINTS.GRADES.BY_IDS}?${query}`;

    const response = await api.get<Grade[]>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch grades:", response.error);
    }

    return response.data!;
  },

  async fetchGradeById(id: number): Promise<Grade> {
    const url = `${API_ENDPOINTS.GRADES.DEFAULT}/${id}`;

    const response = await api.get<Grade>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch grade with ID: " + id, response.error);
    }

    return response.data!;
  },
};
