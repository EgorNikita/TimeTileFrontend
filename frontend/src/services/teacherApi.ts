import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils/apiClient";
import { transformAvatarUrls } from "@/services/common/serviceUtils";

export interface Teacher {
  id: number;
  firstname: string;
  lastname: string;
  homeAddress: string;
  phoneNumber: string;
  birthDate: Date;
  login: string;
  roleId: number;
  weekWorkHours: number;
  avatarUrl: string;
  preferredClassroomId?: number | null;
}

export const teacherApi = {
  async fetchTeachersByIds(ids: number[]): Promise<Teacher[]> {
    if (ids.length === 0) return [];

    const query = ids.map((id) => `ids=${id}`).join("&");
    const url = `${API_ENDPOINTS.TEACHERS.BY_IDS}?${query}`;

    const response = await api.get<Teacher[]>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch teachers:" + response.error);
    }

    return transformAvatarUrls(response.data);
  },
};
