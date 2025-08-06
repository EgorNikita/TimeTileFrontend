import { onUnmounted } from "vue";
import { useQueryClient } from "@tanstack/vue-query";
import type { MessageFilters } from "@/types/message";
import { useSignalRStore, WebSocketMessage } from "@/stores/SignalRStore";
import {
  MessageEnrichedWithUserInfo,
  useMessagesWithStudent,
} from "@/tanStackQueries/student/message/useMessagesWithStudent";

export function useMessagesWithRealTime(
  filters: MessageFilters = {},
  pageSize = 40,
) {
  const queryClient = useQueryClient();
  const signalR = useSignalRStore();
  const queryKey = ["messages", filters] as const;

  const messagesQuery = useMessagesWithStudent(filters, pageSize);

  const isRelevant = (message: MessageEnrichedWithUserInfo) =>
    !filters.courseIds?.length || filters.courseIds.includes(message.courseId);

  const refreshMessages = async (message: MessageEnrichedWithUserInfo) => {
    if (isRelevant(message)) {
      await queryClient.invalidateQueries({ queryKey });
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
