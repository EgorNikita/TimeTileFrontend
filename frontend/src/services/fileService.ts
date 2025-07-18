import { createApi, defaultApi } from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants";

const api = createApi();

export async function fetchFileByGuidAsFile(guid: string): Promise<File> {
  const url = `${API_ENDPOINTS.FILES}/${guid}`;

  try {
    const response = await defaultApi.downloadFile(url);

    console.log("Response from fetching file by GUID:", response);
    console.log("All headers:", response.headers);
    console.log(
      "Content-Disposition:",
      response.headers["content-disposition"],
    );

    if (!response?.data) {
      throw new Error(`Failed to fetch file: 'No data received'`);
    }

    const blob = response.data as Blob;
    let filename = "downloaded-file";

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers["content-disposition"];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename=([^;]+)/i);
      if (match?.[1]) {
        filename = decodeURIComponent(match[1].trim());
      }
    }

    const contentType =
      response.headers["content-type"] ||
      blob.type ||
      "application/octet-stream";

    return new File([blob], filename, { type: contentType });
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}
