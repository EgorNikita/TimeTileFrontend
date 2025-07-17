import { createApi } from "@/utils/apiClient"; // your axios or fetch wrapper
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";
import {
  Assignment,
  AssignmentFilters,
  Submission,
  SubmissionFilters,
} from "@/types/assignment";

const api = createApi();

export async function fetchAssignments(
  params: PagedListParams<AssignmentFilters> = {},
): Promise<PagedList<Assignment>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.ASSIGNMENTS}?${queryString}`
    : API_ENDPOINTS.ASSIGNMENTS;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error || "Failed to fetch courses");
  }

  return response.data;
}

export async function fetchSubmissions(
  params: PagedListParams<SubmissionFilters> = {},
): Promise<PagedList<Submission>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.SUBMISSIONS}?${queryString}`
    : API_ENDPOINTS.SUBMISSIONS;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error || "Failed to fetch courses");
  }

  return response.data;
}
