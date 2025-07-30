import { ResultPattern } from "@/utils/resultPattern";
import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils/apiClient";

export interface LoginRequest {
  login: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  userId: number;
  institutionId: number;
}

export const authApi = {
  async login(request: LoginRequest): Promise<ResultPattern<LoginResponse>> {
    return api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, request);
  },

  async checkAuth(): Promise<ResultPattern<LoginResponse>> {
    return api.get<LoginResponse>(API_ENDPOINTS.AUTH.CHECK_AUTH);
  },

  async logout(): Promise<ResultPattern<void>> {
    return api.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
