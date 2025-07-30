import { defaultApi } from "@/utils/apiClient";
import { API_ENDPOINTS } from "@/constants";
import {EnrichedFile} from "@/types/file";
import { AxiosResponse } from "axios";

export async function fetchFilesByUrls(urls: string[]): Promise<EnrichedFile[]> {
  const promises = urls.map((url) => fetchFileByGuidAsFile(url));
  return Promise.all(promises);
}

export async function fetchRawFilesByUrls(urls: string[]): Promise<File[]> {
  const promises = urls.map((url) => fetchRawFileByGuidAsFile(url));
  return Promise.all(promises);
}

export async function fetchFileByGuidAsFile(guid:string): Promise<EnrichedFile> {
  return {
    file: await fetchRawFileByGuidAsFile(guid),
    guid: guid
  };
}

export async function fetchRawFileByGuidAsFile(guid: string): Promise<File> {
  const url = `${API_ENDPOINTS.FILES}/${guid}`;

  try {
    const response = await defaultApi.downloadFile(url);

    // console.log("Response from fetching file by GUID:", response);
    // console.log("All headers:", response.headers);
    // console.log(
    //   "Content-Disposition:",
    //   response.headers["content-disposition"],
    // );

    if (!response?.data) {
      throw new Error(`Failed to fetch file: 'No data received'`);
    }

    const blob = response.data as Blob;

    // Extract filename from Content-Disposition header
    const filename = extractFilename(response) || "unknown.bin";

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

function extractFilename(response: AxiosResponse<Blob>): string | null {
  const contentDisposition = response.headers["content-disposition"];

  if (contentDisposition) {
    // Split the header by semicolons and examine each part
    const parts = contentDisposition.split(';').map(part => part.trim());

    // Look for filename*=UTF-8'' format (RFC 6266)
    for (const part of parts) {
      if (part.toLowerCase().startsWith('filename*=utf-8\'\'')) {
        const encodedValue = part.substring('filename*=utf-8\'\''.length);
        return decodeURIComponent(encodedValue);
      }
    }
  }

  return null;
}
