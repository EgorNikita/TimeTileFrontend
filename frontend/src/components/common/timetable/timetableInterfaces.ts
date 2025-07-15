import { EnrichedLesson } from "@/types/lesson";
import { TimetableUnit } from "@/types/timetable";

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

export interface ProcessedLesson extends EnrichedLesson {
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
