import { useInfiniteQuery } from "@tanstack/vue-query";
import type { MessageFilters, PaginatedMessages } from "@/types/message";
import { messageApi } from "@/services/messageApi";

export function useMessages(filters: MessageFilters = {}, pageSize = 20) {
  return useInfiniteQuery<PaginatedMessages["pages"][0]>({
    queryKey: ["messages", filters],

    queryFn: ({ pageParam }) =>
      messageApi.fetchMessages(filters, pageParam, pageSize),

    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
  });
}
