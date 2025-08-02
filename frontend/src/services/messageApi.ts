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

export const messageApi = {
  async fetchMessages(
    params: PagedListParams<MessageFilters> = {},
  ): Promise<PagedList<EnrichedMessage>> {
    const queryString = buildQueryParams(params);
    const url = queryString
      ? `${API_ENDPOINTS.MESSAGES}?${queryString}`
      : API_ENDPOINTS.MESSAGES;

    const response = await api.get<PagedList<EnrichedMessage>>(url);

    if (!response.isSuccess || !response.data) {
      throw new Error("Failed to fetch messages: " + response.error);
    }

    return response.data;
  },

  async fetchFilesByUrls(urls: string[]): Promise<MessageFile[]> {
    if (!urls.length) return [];

    const response = await api.post<MessageFile[]>(
      API_ENDPOINTS.MESSAGE_FILES_BY_URLS,
      { urls },
    );

    if (!response.isSuccess || !response.data) {
      throw new Error("Failed to fetch message files: " + response.error);
    }

    return response.data;
  },

  async sendMessage(payload: {
    content: string;
    fileUrls?: string[];
    courseId: string;
  }): Promise<EnrichedMessage> {
    const response = await api.post<EnrichedMessage>(
      API_ENDPOINTS.SEND_MESSAGE,
      payload,
    );

    if (!response.isSuccess || !response.data) {
      throw new Error("Failed to send message: " + response.error);
    }

    return response.data;
  },
};
