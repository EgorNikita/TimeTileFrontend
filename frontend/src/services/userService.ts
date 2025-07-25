import { User } from "@/types/user";
import { API_ENDPOINTS } from "@/constants";
import { createApi } from "@/utils/apiClient";
import { transformAvatarUrls } from "@/services/common/serviceUtils";

const api = createApi();

export async function fetchUsersByIds(ids: number[]): Promise<User[]> {
  if (ids.length === 0) return [];

  const query = ids.map((id) => `ids=${id}`).join("&");
  const url = `${API_ENDPOINTS.USERS.BY_IDS}?${query}`;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch users");
  }

  return transformAvatarUrls(response.data);
}