import {
  XCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/solid";
import { Component } from "vue";

export interface Assignment {
  id: string | number;
  title: string;
  description: string;
  publishedAt: Date;
  deadline: Date;
  uploadAfterDeadline: boolean;
  hasAttachment: boolean;

  courseId: string | number;
}

export interface AssignmentFilters {
  studentIds?: number[];
  courseIds?: (string | number)[];
}

export interface Submission {
  id: string | number;
  assignmentId: string | number;
  studentId: number;
  gradeId?: number;
  status: Status;
  studentNote?: string;
  teacherFeedback?: string;
  hasAttachment: boolean;

  submittedAt?: Date;
}

export interface SubmissionFilters {
  studentIds?: number[];
  assignmentIds?: number;
  statuses?: string[];
}

export interface AssignmentsWithSubmission {
  assignment: Assignment;
  submissions: Submission;
}

export enum Status {
  NOT_SUBMITTED = "NotSubmitted",
  SUBMITTED = "Submitted",
  SUBMITTED_LATE = "SubmittedLate",
  ACCEPTED = "Accepted",
  REJECTED = "Rejected",
}

export interface GroupedAssignmentByDate {
  date: string;
  day: string;
  items: AssignmentsWithSubmission[];
}

export interface StatusMeta {
  text: string;
  colorClass: string;
  icon: Component;
}

export const statusMetaMap: Record<Status, StatusMeta> = {
  [Status.NOT_SUBMITTED]: {
    text: "Not Submitted",
    colorClass: "text-red-500",
    icon: ClockIcon,
  },
  [Status.SUBMITTED]: {
    text: "Turned In",
    colorClass: "text-blue-500",
    icon: PaperAirplaneIcon,
  },
  [Status.SUBMITTED_LATE]: {
    text: "Submitted Late",
    colorClass: "text-yellow-500",
    icon: PaperAirplaneIcon,
  },
  [Status.ACCEPTED]: {
    text: "Turned In",
    colorClass: "text-green-500",
    icon: CheckCircleIcon,
  },
  [Status.REJECTED]: {
    text: "Rejected",
    colorClass: "text-red-700",
    icon: XCircleIcon,
  },
};
