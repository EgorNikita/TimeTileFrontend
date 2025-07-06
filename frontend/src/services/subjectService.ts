import { createApi } from "@/utils/apiClient";
import { Routes } from "@/common/routes";
import { type ResultPattern, success } from "@/utils/resultPattern";
import { SubjectDto } from "@/types/subject";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";

const api = createApi();

export interface GetSubjectsBulkParams {
  ids: number[];
}

export interface SubjectsResult extends ResultPattern<Array<SubjectDto>> {}

export async function fetchSubjects(
  params: GetSubjectsBulkParams,
): Promise<SubjectsResult> {
  const arrayKeys: (keyof GetSubjectsBulkParams)[] = ["ids"];

  const queryString = buildQueryParams(params, arrayKeys, []);
  const url = queryString ? `${Routes.Subjects}/bulk?${queryString}` : Routes.Subjects;
  const response = await api.get(url);

  return success(response.data);
}