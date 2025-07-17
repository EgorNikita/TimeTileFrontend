import { API_ENDPOINTS } from "@/constants";
import { createApi } from "@/utils/apiClient";
import { Room } from "@/types/room";

const api = createApi();

export async function fetchRoomsByIds(ids: number[]): Promise<Room[]> {
  if (ids.length === 0) return [];

  const query = ids.map((id) => `ids=${id}`).join("&");
  const url = `${API_ENDPOINTS.CLASSROOMS.BY_IDS}?${query}`;

  const response = await api.get(url);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error ?? "Failed to fetch rooms");
  }

  return response.data;
}
