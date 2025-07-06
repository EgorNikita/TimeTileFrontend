import { createApi } from "@/utils/apiClient"; // Your Axios wrapper
import type { Subject } from "@/types/subject";

const api = createApi();

export async function fetchSubjectsbyIds(ids: number[]): Promise<Subject[]> {
  if (ids.length === 0) return { value: [] };

  const query = ids.map((id) => `ids=${id}`).join("&");
  const url = `/subjects/bulk?${query}`;

  console.log("[fetchBulkSubjects] Fetching:", url);
  const response = await api.get(url);
  console.log("[fetchBulkSubjects] Response:", response.data);

  if (!response || !response.isSuccess || !response.data) {
    throw new Error(response?.error?.message || "Failed to fetch subjects");
  }

  return response.data;
}
