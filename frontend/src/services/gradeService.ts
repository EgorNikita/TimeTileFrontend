import { type ResultPattern, success } from "@/utils/resultPattern";
import { PagedList } from "@/common/types/pagedList";
import { GradeDto } from "@/types/grade";
import { Routes } from "@/common/routes";
import { createApi } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";

const api = createApi();

export interface GetGradesParams {
  lessonIds?: number[];
  studentIds?: number[];
  courseIds?: number[];
  types?: GradeType[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
}

export interface PagedGradesResult extends ResultPattern<PagedList<GradeDto>> {}

export async function fetchGrades(
  params: GetGradesParams = {},
): Promise<PagedGradesResult> {
  const arrayKeys: (keyof GetGradesParams)[] = [
    "lessonIds",
    "studentIds",
    "courseIds",
    "types",
  ];

  const scalarKeys: (keyof GetGradesParams)[] = [
    "page",
    "pageSize",
    "sortBy",
    "descending",
  ];

  const queryString = buildQueryParams(params, arrayKeys, scalarKeys);
  const url = queryString ? `${Routes.Grades}?${queryString}` : Routes.Grades;
  const response = await api.get(url);

  return success(response.data);
}
