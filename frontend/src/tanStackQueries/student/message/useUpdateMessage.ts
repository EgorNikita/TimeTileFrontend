import { useMutation } from "@tanstack/vue-query";
import { UpdateMessagePayload } from "@/types/message";
import { updateMessage } from "@/services/messageService";

export function useUpdateMessage() {
  return useMutation({
    mutationFn: (data: {
      messageId: number,
      payload: UpdateMessagePayload
    }) => updateMessage(data.messageId, data.payload),
    onSuccess: () => {
      console.log('Message updated successfully');
    },
    onError: (error: unknown) => {
      console.error("Message update failed:", error);
    }
  })
}