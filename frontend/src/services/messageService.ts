import { PagedListParams } from "@/types/common/PagedList";
import { CreateMessagePayload, Message, MessageFilters, UpdateMessagePayload } from "@/types/message";
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
    ? `${API_ENDPOINTS.MESSAGES.DEFAULT}?${queryString}`
    : API_ENDPOINTS.MESSAGES.DEFAULT;

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
    API_ENDPOINTS.MESSAGES.DEFAULT,
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

export async function updateMessage(
  messageId: number,
  payload: UpdateMessagePayload
): Promise<void> {
  if (!payload.content && !payload.filesToAdd?.length && !payload.filesToRemove?.length) {
    return; // Nothing to update
  }

  const formData = new FormData();

  if (payload.content !== undefined) {
    formData.append("content", payload.content);
  }

  if (payload.filesToAdd && payload.filesToAdd.length > 0) {
    for (const file of payload.filesToAdd) {
      formData.append("filesToAdd", file);
    }
  }

  if (payload.filesToRemove && payload.filesToRemove.length > 0) {
    for (const fileGuid of payload.filesToRemove) {
      formData.append("filesToRemove", fileGuid.toString());
    }
  }

  const response = await api.patch(
    API_ENDPOINTS.MESSAGES.PATCH(messageId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!response || !response.isSuccess) {
    throw new Error(response?.error ?? "Updating message failed");
  }
}