import { createApi } from "@/utils/apiClient.ts";
const api = createApi();

export async function fetchInstitutionById(id) {
  return await api.get(`/institutions/${id}`);
}
