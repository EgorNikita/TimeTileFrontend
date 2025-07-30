import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils/apiClient";

export interface Room {
  id: number;
  title: string;
  capacity: number;
  type: RoomType;
}

interface RoomType {
  id: number;
  description: string;
  iconUrl?: string;
}

export const roomApi = {
  async fetchRoomsByIds(ids: number[]): Promise<Room[]> {
    if (ids.length === 0) return [];

    const query = ids.map((id) => `ids=${id}`).join("&");
    const url = `${API_ENDPOINTS.CLASSROOMS.BY_IDS}?${query}`;

    const response = await api.get<Room[]>(url);

    if (!response.isSuccess || !response.data) {
      console.error("Failed to fetch rooms:", response.error);
    }

    return response.data!;
  },
};
