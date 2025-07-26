import { CreateMessagePayload } from "@/types/message";
import { useMutation } from "@tanstack/vue-query";
import { createMessage } from "@/services/messageService";

export function useCreateMessage() {
  return useMutation({
    mutationFn: (data: CreateMessagePayload) => createMessage(data),
    onSuccess: () => {
      console.log('Message created successfully');
    },
    onError: (error: unknown) => {
      console.error("Message creation failed:", error);
    }
  });
}