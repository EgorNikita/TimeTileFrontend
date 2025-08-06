import { useInfiniteQuery } from "@tanstack/vue-query";
import type { MessageFilters } from "@/types/message";
import { Message, messageApi } from "@/services/messageApi";
import { PagedList } from "@/common/types/pagedList";
import { User, userApi } from "@/services/userApi";

export interface MessageEnrichedWithUserInfo extends Message {
  user: User;
}

export function useMessagesWithStudent(
  filters: MessageFilters = {},
  pageSize = 20,
) {
  return useInfiniteQuery({
    queryKey: ["messages", filters],

    queryFn: async ({ pageParam = 1 }) => {
      const messages = await messageApi.fetchMessages({
        ...filters,
        page: pageParam,
        pageSize,
      });

      const userIds = messages.items.map((m) => m.userId);

      const users = await userApi.fetchUsersByIds(userIds);

      const userMap = new Map<number, User>();
      for (const user of users) {
        userMap.set(user.id, user);
      }

      const enrichedMessages: MessageEnrichedWithUserInfo[] =
        messages.items.map((message) => {
          const messageUser = userMap.get(message.userId);

          if (!messageUser) {
            throw new Error(`User with ID ${message.userId} not found`);
          }

          return {
            ...message,
            user: messageUser,
          };
        });

      // Return the PagedList structure with enriched messages
      return {
        ...messages,
        items: enrichedMessages,
      } as PagedList<MessageEnrichedWithUserInfo>;
    },

    getNextPageParam: (
      lastPage: PagedList<MessageEnrichedWithUserInfo>,
      allPages: PagedList<MessageEnrichedWithUserInfo>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    initialPageParam: 1,
  });
}
