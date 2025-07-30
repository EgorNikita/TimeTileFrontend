import { api } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { PagedList } from "@/common/types/pagedList";
import { PagedListParams } from "@/types/common/PagedList";

export interface Assignment {
  id: number;
  title: string;
  description: string;
  publishedAt: Date;
  deadline: Date;
  uploadAfterDeadline: boolean;
  hasAttachments: boolean;
  courseId: number;
}

export interface AssignmentFilters {
  studentIds?: number[];
  courseIds?: (string | number)[];
}

export interface FileInfo {
  fileUrl: string;
}

export enum Status {
  NOT_SUBMITTED = "NotSubmitted",
  SUBMITTED = "Submitted",
  SUBMITTED_LATE = "SubmittedLate",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  EXPIRED = "Expired",
}

export interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  gradeId?: number;
  status: Status;
  studentNote?: string;
  feedback?: string;
  hasAttachments: boolean;
  submittedAt?: string;
}

export interface SubmissionFilters {
  studentIds?: number[];
  assignmentIds?: number;
  statuses?: string[];
}

export interface SubmitSubmissionPayload {
  id: number;
  studentNote?: string;
  filesToAdd?: File[]; // raw File objects from input or drag/drop
  filesToRemove?: number[]; // file IDs to delete
}

export const assignmentApi = {
  async fetchAssignments(
    params: PagedListParams<AssignmentFilters> = {},
  ): Promise<PagedList<Assignment>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.ASSIGNMENTS.DEFAULT}?${queryString}`
      : API_ENDPOINTS.ASSIGNMENTS.DEFAULT;

    const response = await api.get<PagedList<Assignment>>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch assignments:", response.error);
    }

    return response.data!;
  },

  async fetchAssignmentsByIds(ids: number[]): Promise<Assignment[]> {
    if (ids.length === 0) return [];

    const query = ids.map((id) => `ids=${id}`).join("&");
    const url = `${API_ENDPOINTS.ASSIGNMENTS.BY_IDS}?${query}`;

    const response = await api.get<Assignment[]>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch assignments by IDs:", response.error);
    }

    return response.data!;
  },

  async fetchSubmissions(
    params: PagedListParams<SubmissionFilters> = {},
  ): Promise<PagedList<Submission>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.SUBMISSIONS.DEFAULT}?${queryString}`
      : API_ENDPOINTS.SUBMISSIONS.DEFAULT;

    const response = await api.get<PagedList<Submission>>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch submissions:", response.error);
    }

    return response.data!;
  },

  async fetchAssignmentFiles(assignmentId: number): Promise<FileInfo[]> {
    const url = API_ENDPOINTS.ASSIGNMENTS.FILES(assignmentId);

    const response = await api.get<FileInfo[]>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch assignment files:", response.error);
    }

    return response.data!;
  },

  async fetchSubmissionFiles(submissionId: number): Promise<FileInfo[]> {
    const url = API_ENDPOINTS.SUBMISSIONS.FILES(submissionId);

    const response = await api.get<FileInfo[]>(url);

    if (!response.isSuccess || response.data == null) {
      console.error("Failed to fetch submission files:", response.error);
    }

    return response.data!;
  },

  async submitSubmission(payload: SubmitSubmissionPayload): Promise<void> {
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

    if (!response.isSuccess) {
      console.error("Submission failed:", response.error);
    }
  },
};
