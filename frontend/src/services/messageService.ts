import { PagedListParams } from "@/types/common/PagedList";
import { CreateMessagePayload, Message, MessageFilters } from "@/types/message";
import { PagedList } from "@/common/types/pagedList";
import { buildQueryParams } from "@/helpers/queryParamsBuilder";
import { API_ENDPOINTS } from "@/constants";
import { createApi } from "@/utils/apiClient";

const api = createApi();

export async function fetchMessages(
  params: PagedListParams<MessageFilters> = {},
): Promise<PagedList<Message>> {
  const queryString = buildQueryParams(params);
  const url = queryString
    ? `${API_ENDPOINTS.MESSAGES}?${queryString}`
    : API_ENDPOINTS.MESSAGES;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch messages");
  }

  return response.data;
}

export async function createMessage(
  payload: CreateMessagePayload
): Promise<void> {
  const formData = new FormData();

  formData.append("courseId", payload.courseId.toString());

  if (payload.content !== undefined) {
    formData.append("content", payload.content);
  }

  if (payload.files && payload.files.length > 0) {
    for (const file of payload.files) {
      formData.append("files", file);
    }
  }

  const response = await api.post(
    API_ENDPOINTS.MESSAGES,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!response || !response.isSuccess) {
    throw new Error(response?.error ?? "Creating message failed");
  }
}