import { createApi } from "@/utils/apiClient";
import type { ResultPattern } from "@/utils/resultPattern";
import { success, failure } from "@/utils/resultPattern";
import { PagedList } from "@/common/types/pagedList";
import { CourseDto } from "@/types/course";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { Routes } from "@/common/routes";

const api = createApi();

export interface PagedCourseResult extends ResultPattern<PagedList<CourseDto>> {}
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

export async function fetchCourses(
  params: GetCoursesParams = {},
): Promise<PagedCourseResult> {
  const arrayKeys: (keyof GetCoursesParams)[] = [
    "subjectIds",
    "teacherIds",
    "termIds",
    "studentIds",
    "groupIds"
  ];

  const scalarKeys: (keyof GetCoursesParams)[] = [
    "page",
    "pageSize",
    "sortBy",
    "descending"
  ];

  const queryString = buildQueryParams(params, arrayKeys, scalarKeys);
  const url = queryString ? `${Routes.Courses}?${queryString}` : Routes.Courses;
  const response = await api.get(url);

  return success(response.data);
}

export async function fetchCourseById(id: number): Promise<CourseResult> {
  const response = await api.get(`${Routes.Courses}/${id}`);

  return success(response.data);
}
