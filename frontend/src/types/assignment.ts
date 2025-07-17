import {
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/solid";
import { Component } from "vue";
import { Course } from "@/types/course";

export interface Assignment {
  id: string | number;
  title: string;
  description: string;
  publishedAt: Date;
  deadline: Date;
  uploadAfterDeadline: boolean;
  hasAttachment: boolean;
  courseId: number;
}

export interface EnrichedAssignment extends Assignment {
  course: Course;
}

export interface AssignmentFilters {
  studentIds?: number[];
  courseIds?: (string | number)[];
}

export interface Submission {
  id: string | number;
  assignmentId: number;
  studentId: number;
  gradeId?: number;
  status: Status;
  studentNote?: string;
  teacherFeedback?: string;
  hasAttachment: boolean;

  submittedAt?: string;
}

export interface SubmissionFilters {
  studentIds?: number[];
  assignmentIds?: number;
  statuses?: string[];
}

export interface AssignmentsWithSubmission<T extends Assignment = Assignment> {
  assignment: T;
  submission: Submission;
}

// Usage:
export type BasicAssignmentWithSubmission =
  AssignmentsWithSubmission<Assignment>;
export type EnrichedAssignmentWithSubmission =
  AssignmentsWithSubmission<EnrichedAssignment>;

export enum Status {
  NOT_SUBMITTED = "NotSubmitted",
  SUBMITTED = "Submitted",
  SUBMITTED_LATE = "SubmittedLate",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
  EXPIRED = "Expired",
}

export interface GroupedAssignmentByDate {
  date: string;
  day: string;
  items: EnrichedAssignmentWithSubmission[];
}

export interface StatusMeta {
  text: string;
  bgColorClass: string;
  textColorClass: string;
  icon: Component;
}

export const statusMetaMap: Record<Status, StatusMeta> = {
  [Status.NOT_SUBMITTED]: {
    text: "Not Submitted",
    bgColorClass: "bg-gray-200",
    textColorClass: "text-gray-600",
    icon: ClockIcon,
  },
  [Status.EXPIRED]: {
    text: "Expired",
    bgColorClass: "bg-orange-100",
    textColorClass: "text-orange-500",
    icon: ExclamationTriangleIcon,
  },
  [Status.SUBMITTED]: {
    text: "Submitted",
    bgColorClass: "bg-blue-100",
    textColorClass: "text-blue-500",
    icon: PaperAirplaneIcon,
  },
  [Status.SUBMITTED_LATE]: {
    text: "Submitted Late",
    bgColorClass: "bg-yellow-100",
    textColorClass: "text-yellow-500",
    icon: PaperAirplaneIcon,
  },
  [Status.ACCEPTED]: {
    text: "Turned In",
    bgColorClass: "bg-green-100",
    textColorClass: "text-green-500",
    icon: CheckCircleIcon,
  },
  [Status.REJECTED]: {
    text: "Rejected",
    bgColorClass: "bg-red-100",
    textColorClass: "text-red-600",
    icon: XCircleIcon,
  },
};
