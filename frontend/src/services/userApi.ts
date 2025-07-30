import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils/apiClient";
import { transformAvatarUrls } from "@/services/common/serviceUtils";

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
    const url = `${API_ENDPOINTS.USERS}/${userId}`;
    const response = await api.get<User>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch user:" + response.error);
    }

    return transformAvatarUrls([response.data])[0];
  },
};
