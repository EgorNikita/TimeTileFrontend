import { FileInfo } from "@/types/assignment";
import { User } from "@/types/user";
import {EnrichedFile} from "@/types/file";

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
  files: EnrichedFile[];
}

export interface MessageFilters {
  senderIds?: number[];
  courseIds?: number[];
  userIds?: number[];
  from?: string;
  until?: string;
}

export interface CreateMessagePayload {
  courseId: number;
  content?: string;
  files?: File[];
}

export interface UpdateMessagePayload {
  content?: string;
  filesToAdd?: File[];
  filesToRemove?: string[];
}