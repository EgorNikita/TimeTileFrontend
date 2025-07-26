import { FileInfo } from "@/types/assignment";
import { User } from "@/types/user";

export interface Message {
  id: number;
  userId: number;
  courseId: number;
  content?: string;
  sentAt: Date;
  editedAt?: Date;
  fileUrls: FileInfo[];
}

export interface EnrichedMessage extends Message {
  user: User;
  files: File[];
}

export interface MessageFilters {
  senderIds?: number[];
  courseIds?: number[];
  userIds?: number[];
  from?: string;
  until?: string;
}