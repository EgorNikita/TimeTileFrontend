import { api } from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants";

export const fileApi = {
  async fetchFileByGuidAsFile(guid: string): Promise<File> {
    const url = `${API_ENDPOINTS.FILES}/${guid}`;

    const response = await api.downloadFileWithMetadata(url);

    if (!response.isSuccess || !response.data) {
      console.error("Failed to fetch file by GUID:", response.error);
      throw new Error("Failed to fetch file: No data received");
    }

    const blob = response.data.blob;
    const headers = response.data.headers;
    let filename = "downloaded-file";

    // Extract filename from Content-Disposition header
    const contentDisposition = headers["content-disposition"];
    if (contentDisposition) {
      const match = RegExp(/filename=([^;]+)/i).exec(contentDisposition);
      if (match?.[1]) {
        filename = decodeURIComponent(match[1].trim());
      }
    }

    const contentType =
      headers["content-type"] || blob.type || "application/octet-stream";

    return new File([blob], filename, { type: contentType });
  },
};
