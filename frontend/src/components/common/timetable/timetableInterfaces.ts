import { Lesson, TimetableUnit } from "@/types/lesson";

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

export interface ProcessedLesson extends Lesson {
  dayIndex: number;
  gridRowStart: number;
  rowSpan: number;
  startTime: string;
  endTime: string;
  units: TimetableData[];
}

export interface TimetableData extends TimetableUnit {
  duration: number;
  startMinutes: number;
  endMinutes: number;
  isBreak: boolean;
}
