import { LessonStatus } from "@/types/lesson";
import { TimetableUnit } from "@/types/timetable";
import { StudentEnrichedLessonInfo } from "@/types/studentLessonsInfo";

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

export interface TimetableLesson extends StudentEnrichedLessonInfo {
  status: LessonStatus;
}

export interface ProcessedLesson extends TimetableLesson {
  dayIndex: number;
  gridRowStart: string | number;
  rowSpan: number;
  units: TimetableData[];
}

export interface TimetableData extends TimetableUnit {
  duration: number;
  startMinutes: number;
  endMinutes: number;
  isBreak: boolean;
}
