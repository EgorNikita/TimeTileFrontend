import { EnrichedLesson, Lesson } from "@/types/lesson";
import { Grade } from "@/types/grade";

interface BaseStudentLessonInfo {
  lessonId: number;
  cameAt?: string;
  leftAt?: string;
  gradeId?: number;
}

export interface StudentLessonInfo extends BaseStudentLessonInfo {
  lesson: Lesson;
}

export interface StudentEnrichedLessonInfo extends BaseStudentLessonInfo {
  lesson: EnrichedLesson;
}

export interface StudentLessonInfoWithGrades extends StudentLessonInfo {
  homeworkGrade?: Grade;
  classworkGrade?: Grade;
}

export interface StudentLessonFilters {
  courseIds?: number[];
  from?: string;
  until?: string;
}

export interface StudentAttendanceCountInfo {
  totalLessons: number;
  attendedLessons: number;
}

export interface StudentAttendanceCountFilters {
  courseIds?: number[];
}
