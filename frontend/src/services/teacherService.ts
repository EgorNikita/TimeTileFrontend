import { API_ENDPOINTS } from "@/constants";
import { createApi } from "@/utils/apiClient";
import { Teacher } from "@/types/teacher";
import { transformAvatarUrls } from "@/services/common/serviceUtils";

const api = createApi();

export async function fetchTeachersByIds(ids: number[]): Promise<Teacher[]> {
  if (ids.length === 0) return [];

  const query = ids.map((id) => `ids=${id}`).join("&");
  const url = `${API_ENDPOINTS.TEACHERS.BY_IDS}?${query}`;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch teachers");
  }

  return transformAvatarUrls(response.data);
}
