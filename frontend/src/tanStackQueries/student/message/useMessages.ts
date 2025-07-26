import { EnrichedMessage, MessageFilters } from "@/types/message";
import { useInfiniteQuery } from "@tanstack/vue-query";
import { fetchMessages } from "@/services/messageService";
import { PagedList } from "@/common/types/pagedList";
import { fetchUsersByIds } from "@/services/userService";
import { fetchFilesByUrls } from "@/services/fileService";

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

      const enrichedMessagesPromises = messages.map(async (message) => {
        const user = users.find(u => u.id === message.userId);
        const files = await fetchFilesByUrls(message.fileUrls);       // TODO: bulk endpoint on files
        return {
          ...message,
          user: user,
          files: files
        };
      });

      const enrichedMessages: EnrichedMessage[] = (await Promise.all(enrichedMessagesPromises))
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

    staleTime: 0,
    initialPageParam: 1,
  })
}