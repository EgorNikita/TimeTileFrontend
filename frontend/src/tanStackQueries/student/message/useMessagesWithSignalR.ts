import { EnrichedMessage, MessageFilters } from "@/types/message";
import { useQueryClient } from "@tanstack/vue-query";
import { useMessages } from "@/tanStackQueries/student/message/useMessages";
import { useSignalRStore, WebSocketMessage } from "@/store/modules/signalR";
import { onUnmounted } from "vue";

export function useMessagesWithSignalR(
  filters: MessageFilters = {},
  pageSize = 20
) {
  const signalR = useSignalRStore();
  const queryClient = useQueryClient();
  const messagesQuery = useMessages(filters, pageSize);

  const handleNewMessage = (message: EnrichedMessage) => {
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