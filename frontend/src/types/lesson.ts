export interface LessonStatus {
  id: string | number;
  title: string;
  color: string;
}

export interface LessonFilters {
  studentIds?: number[];
  groupIds?: number[];
  classroomIds?: number[];
  timetableUnitIds?: number[];
  courseIds?: number[];
  lessonStatusIds?: number[];
  from?: string;
  until?: string;
}

export interface Lesson {
  id: string | number;
  courseId: string | number;
  subjectId: number;
  teacherId: number;
  roomId: number;
  statusId: number;
  timetableUnitIds: (string | number)[];
  date: Date;
  description?: string;
  assigmentId?: string;

  bgColor?: string;
  titleColor?: string;
}

export interface EnrichedLesson extends Lesson {
  courseTitle: string;
  subjectTitle: string;
  teacherName: string;
  roomTitle: string;
  status: LessonStatus;
}
