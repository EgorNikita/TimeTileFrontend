import { Lesson, LessonStatus, TimetableUnit } from "@/types/lesson";

export interface Day {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface WeekDay {
  short: string;
  full: string;
  date: number;
  fullDate: Date;
  isToday: boolean;
}

export interface EnrichedLesson extends Lesson {
  courseTitle: string;
  subjectTitle: string;
  teacherName: string;
  roomTitle: string;
  status: LessonStatus;
}

export interface ProcessedLesson extends EnrichedLesson {
  dayIndex: number;
  gridRowStart: string | number;
  rowSpan: number;
  // startTime: string;
  // endTime: string;
  units: TimetableData[];
}

export interface TimetableData extends TimetableUnit {
  duration: number;
  startMinutes: number;
  endMinutes: number;
  isBreak: boolean;
}
