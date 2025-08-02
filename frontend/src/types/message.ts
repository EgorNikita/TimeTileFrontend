export interface MessageFilters {
  courseIds?: number[];
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface BaseMessage {
  id: string;
  content: string;
  userId: string;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  fileUrls: string[];
}

export interface EnrichedMessage extends BaseMessage {
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
