import { Lesson } from "@/types/lesson";
import { Grade } from "@/types/grade";

export interface StudentLessonInfo {
  lessonId: number;
  lesson: Lesson;
  cameAt?: string;
  leftAt?: string;
  gradeId?: number;
}

export interface StudentLessonInfoWithGrades extends StudentLessonInfo {
  homeworkGrade?: Grade;
  classworkGrade?: Grade;
}

export interface StudentLessonFilters {
  courseIds?: number[];
}

export interface StudentAttendanceCountInfo {
  totalLessons: number;
  attendedLessons: number;
}

export interface StudentAttendanceCountFilters {
  courseIds?: number[];
}
