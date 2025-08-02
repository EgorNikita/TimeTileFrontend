import { useQuery } from "@tanstack/vue-query";
import { fileApi } from "@/services/fileService";
import type { MessageFile } from "@/types/message";

export function useMessageFiles(fileUrls: string[]) {
  return useQuery<MessageFile[]>({
    queryKey: ["message-files", fileUrls],

    queryFn: () => fileApi.fetchFilesByUrls(fileUrls),

    enabled: fileUrls.length > 0,

    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
}
