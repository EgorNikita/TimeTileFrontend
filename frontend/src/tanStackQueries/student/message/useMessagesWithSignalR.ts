import { EnrichedMessage, MessageFilters } from "@/types/message";
import { useQueryClient } from "@tanstack/vue-query";
import { useMessages } from "@/tanStackQueries/student/message/useMessages";
import { useSignalRStore, WebSocketMessage } from "@/store/modules/signalR";
import { onUnmounted } from "vue";
import { transformAvatarUrl } from "@/services/common/serviceUtils";
import { fetchFilesByUrls } from "@/services/fileService";

export function useMessagesWithSignalR(
  filters: MessageFilters = {},
  pageSize = 20
) {
  const signalR = useSignalRStore();
  const queryClient = useQueryClient();
  const messagesQuery = useMessages(filters, pageSize);

  const handleNewMessage = async (message: EnrichedMessage) => {
    const messageAppliesHere = filters.courseIds?.includes(message.courseId)

    if (!messageAppliesHere) {
      return // Don't update cache if message doesn't belong here
    }

    message.user = transformAvatarUrl(message.user);
    message.files = await fetchFilesByUrls(message.fileUrls);

    const queryKey = ['messages', filters] as const

    // Add new message to the cache
    queryClient.setQueryData(queryKey, (oldData: any) => {
      if (!oldData?.pages) return oldData

      // Since we're using descending order, new messages go to the first page
      const newPages = [...oldData.pages]
      if (newPages[0]?.items) {
        // Add to the beginning of the first page (newest first)
        newPages[0] = {
          ...newPages[0],
          items: [message, ...newPages[0].items]
        }
      }

      return {
        ...oldData,
        pages: newPages
      }
    })
  }

  signalR.on(WebSocketMessage.MessageReceived, handleNewMessage);

  onUnmounted(() => {
    signalR.off(WebSocketMessage.MessageReceived, handleNewMessage);
  });

  return messagesQuery;
}