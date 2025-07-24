import { PagedListParams } from "@/types/common/PagedList";
import { Message, MessageFilters } from "@/types/message";
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