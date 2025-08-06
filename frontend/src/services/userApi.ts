import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils/apiClient";
import {
  transformAvatarUrls,
  transformIconUrls,
} from "@/services/common/serviceUtils";
import { Course } from "@/services/courseApi";

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  homeAddress: string;
  phoneNumber: string;
  birthDate: Date;
  login: string;
  isStudent: boolean;
  roleId: number;
  avatarUrl: string;
}

export const userApi = {
  async getUserById(userId: number): Promise<User> {
    const url = `${API_ENDPOINTS.USERS.DEFAULT}/${userId}`;
    const response = await api.get<User>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch user:" + response.error);
      throw Error("Failed to fetch user:" + response.error);
    }

    console.log("Fetched user:", response.data);

    return transformAvatarUrls([response.data])[0];
  },

  async fetchUsersByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) return [];

    const query = ids.map((id) => `ids=${id}`).join("&");
    const url = `${API_ENDPOINTS.USERS.BY_IDS}?${query}`;

    const response = await api.get<User[]>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch users:" + response.error);
    }

    return transformAvatarUrls(response.data);
  },
};
