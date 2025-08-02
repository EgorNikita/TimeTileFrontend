import { onUnmounted } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import { useMessages } from "@/tanStackQueries/student/message/useMessages";
import { useSignalRStore, WebSocketMessage } from "@/store/modules/signalR";
import type { MessageFilters, EnrichedMessage } from "@/types/message";

export function useMessagesWithRealTime(
  filters: MessageFilters = {},
  pageSize = 20,
) {
  const queryClient = useQueryClient();
  const signalR = useSignalRStore();
  const queryKey = ["messages", filters] as const;

  const messagesQuery = useMessages(filters, pageSize);

  const isRelevant = (msg: EnrichedMessage) =>
    !filters.courseIds?.length || filters.courseIds.includes(msg.courseId);

  const refreshMessages = (msg: EnrichedMessage) => {
    if (isRelevant(msg)) {
      queryClient.invalidateQueries({ queryKey });
    }
  };

  signalR.on(WebSocketMessage.MessageReceived, refreshMessages);
  signalR.on(WebSocketMessage.MessageEdited, refreshMessages);

  onUnmounted(() => {
    signalR.off(WebSocketMessage.MessageReceived, refreshMessages);
    signalR.off(WebSocketMessage.MessageEdited, refreshMessages);
  });

  return messagesQuery;
}
