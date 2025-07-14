export interface TimetableUnit {
  id: string | number;
  title: string;
  startTime: string;
  endTime: string;
}

interface LessonStatus {
  id: string | number;
  name: string;
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
  courseId: number;
  subjectId: number;
  teacherId: number;
  roomId: number;
  statusId: number;
  timetableUnitIds: (string | number)[];
  date: string;
  description: string;
  homeworkId?: number;

  bgColor?: string;
  titleColor?: string;
}
