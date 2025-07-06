import { createApi } from "@/utils/apiClient.ts";
const api = createApi();

export async function fetchStudentById(id) {
  return await api.get(`/students/${id}`);
}
