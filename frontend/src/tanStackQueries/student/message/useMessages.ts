import { EnrichedMessage, MessageFilters } from "@/types/message";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { fetchMessages } from "@/services/messageService";
import { PagedList } from "@/common/types/pagedList";
import { fetchUsersByIds } from "@/services/userService";

export function useMessages(
  filters: MessageFilters = {},
  pageSize = 20
) {
  return useInfiniteQuery({
    queryKey: ["messages", filters] as const,

    queryFn: async ({ pageParam = 1 }) => {
      const messagesPage = await fetchMessages({
        entity: filters,
        page: pageParam,
        pageSize,
      });
      const messages = messagesPage.items;

      const userIds = Array.from(
        new Set(messages.map((m) => m.userId).filter(Boolean)),
      );

      const users = await fetchUsersByIds(userIds);

      const enrichedMessages: EnrichedMessage[] = messages
        .map((message) => {
          const user = users.find(u => u.id === message.userId);
          return { ...message, user: user };
        })
        .filter((item): item is EnrichedMessage => item !== null);

      return {
        items: enrichedMessages,
        page: messagesPage.page,
        pageSize: messagesPage.pageSize,
        totalCount: messagesPage.totalCount,
        totalPages: messagesPage.totalPages,
      };
    },

    getNextPageParam: (
      lastPage: PagedList<EnrichedMessage>,
      allPages: PagedList<EnrichedMessage>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 15,
    initialPageParam: 1,
  })
}