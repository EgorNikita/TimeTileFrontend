export interface TimetableUnit {
  id: string | number;
  title: string;
  startTime: string;
  endTime: string;
}

export interface LessonStatus {
  id: string | number;
  title: string;
  color: string;
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
