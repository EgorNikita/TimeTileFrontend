import { ResultPattern } from "@/utils/resultPattern";
import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils/apiClient";

export interface Institution {
  id: number;
  title: string;
  address: string;
  phoneNumber: string;
  email: string;
  domain: string;
}

export const institutionApi = {
  async getInstitutionById(
    institutionId: number,
  ): Promise<ResultPattern<Institution>> {
    const url = `${API_ENDPOINTS.INSTITUTIONS}/${institutionId}`;
    return api.get<Institution>(url);
  },
};
