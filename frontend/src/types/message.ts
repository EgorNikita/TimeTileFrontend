import { Sortable } from "@/types/common/Sortable";
import { Message } from "@/services/messageApi";
import { User } from "@/services/userApi";

export interface MessageFilters extends Sortable {
  courseIds?: number[];
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface EnrichedMessage extends Message {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  files?: MessageFile[];
}

export interface MessageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface PaginatedMessages {
  pages: Array<{
    items: EnrichedMessage[];
    hasNextPage: boolean;
    nextCursor?: string;
  }>;
  pageParams: unknown[];
}
