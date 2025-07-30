import { API_ENDPOINTS } from "@/constants";
import { api } from "@/utils/apiClient";

export interface Subject {
  id: number;
  title: string;
}

export const subjectApi = {
  async fetchSubjectsByIds(ids: number[]): Promise<Subject[]> {
    if (ids.length === 0) return [];

    const query = ids.map((id) => `ids=${id}`).join("&");
    const url = `${API_ENDPOINTS.SUBJECTS.BY_IDS}?${query}`;

    const response = await api.get<Subject[]>(url);

    if (!response.isSuccess || !response.data) {
      throw Error("Failed to fetch subjects:" + response.error);
    }

    return response.data;
  },
};
