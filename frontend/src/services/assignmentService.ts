import { createApi } from "@/utils/apiClient"; // your axios or fetch wrapper
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";
import {
  Assignment,
  AssignmentFilters,
  FileInfo,
  Submission,
  SubmissionFilters,
  SubmitSubmissionPayload,
} from "@/types/assignment";

const api = createApi();

export async function fetchAssignments(
  params: PagedListParams<AssignmentFilters> = {},
): Promise<PagedList<Assignment>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.ASSIGNMENTS.DEFAULT}?${queryString}`
    : API_ENDPOINTS.ASSIGNMENTS.DEFAULT;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch assignments");
  }

  return response.data;
}

export async function fetchAssignmentByIds(
  ids: number[],
): Promise<Assignment[]> {
  if (ids.length === 0) return [];

  const query = ids.map((id) => `ids=${id}`).join("&");
  const url = `${API_ENDPOINTS.ASSIGNMENTS.BY_IDS}?${query}`;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch assignments");
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
    throw new Error(response?.error ?? "Failed to fetch submissions");
  }

  return response.data;
}

export async function fetchAssignmentFiles(
  assignmentId: number,
): Promise<FileInfo[]> {
  const url = API_ENDPOINTS.ASSIGNMENTS.FILES(assignmentId);
  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch assignment files");
  }

  return response.data;
}

export async function submitSubmission(
  payload: SubmitSubmissionPayload,
): Promise<void> {
  const formData = new FormData();

  if (payload.studentNote !== undefined) {
    formData.append("StudentNote", payload.studentNote);
  }

  if (payload.filesToAdd && payload.filesToAdd.length > 0) {
    for (const file of payload.filesToAdd) {
      formData.append("FilesToAdd", file);
    }
  }

  if (payload.filesToRemove && payload.filesToRemove.length > 0) {
    for (const fileId of payload.filesToRemove) {
      formData.append("FilesToRemove", fileId.toString());
    }
  }

  const response = await api.patch(
    `/submissions/${payload.id}/submit`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  if (!response || !response.isSuccess) {
    throw new Error(response?.error ?? "Submission failed");
  }
}
