export interface StudentLessonInfo {
  lessonId: number;
  lesson: LessonInfo;
  cameAt?: string;
  leftAt?: string;
  gradeId?: number;
}

interface LessonInfo {
  id: string | number;
  courseId: number;
  subjectId: number;
  teacherId: number;
  roomId: number;
  statusId: number;
  timetableUnitIds: (string | number)[];
  date: string;
  description: string;
  homeworkId?: number;
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