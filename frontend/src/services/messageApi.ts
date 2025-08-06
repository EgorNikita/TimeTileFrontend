import { api } from "@/utils/apiClient";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import type {
  MessageFilters,
  EnrichedMessage,
  MessageFile,
} from "@/types/message";
import type { PagedList } from "@/common/types/pagedList";
import type { PagedListParams } from "@/types/common/PagedList";

export interface Message {
  id: string;
  userId: number;
  courseId: number;
  content?: string;
  sentAt: Date;
  EditedAt?: Date;
  fileUrls: string[];
}

export const messageApi = {
  async fetchMessages(
    params: PagedListParams<MessageFilters> = {},
  ): Promise<PagedList<Message>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.MESSAGES}?${queryString}`
      : API_ENDPOINTS.MESSAGES;

    const response = await api.get<PagedList<Message>>(url);

    if (!response.isSuccess || !response.data) {
      throw new Error("Failed to fetch messages: " + response.error);
    }

    console.log("Fetched messages:", response.data);

    return response.data;
  },

  // async fetchFilesByUrls(urls: string[]): Promise<MessageFile[]> {
  //   if (!urls.length) return [];
  //
  //   const response = await api.post<MessageFile[]>(
  //     API_ENDPOINTS.MESSAGE_FILES_BY_URLS,
  //     { urls },
  //   );
  //
  //   if (!response.isSuccess || !response.data) {
  //     throw new Error("Failed to fetch message files: " + response.error);
  //   }
  //
  //   return response.data;
  // },

  async sendMessage(payload: {
    content?: string;
    files?: File[];
    courseId: number;
  }): Promise<void> {
    const formData = new FormData();

    formData.append("CourseId", payload.courseId.toString());
    if (payload.content) formData.append("Content", payload.content);

    if (payload.files && payload.files.length > 0) {
      for (const file of payload.files) {
        formData.append("Files", file);
      }
    }

    const response = await api.post<EnrichedMessage>(
      API_ENDPOINTS.MESSAGES,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (!response.isSuccess || !response.data) {
      throw new Error("Failed to fetch messages: " + response.error);
    }
  },
};
