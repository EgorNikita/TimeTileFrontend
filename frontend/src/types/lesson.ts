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

export interface Lesson {
  id: string | number;
  subjectId: number;
  teacherId: number;
  roomId: number;
  statusId: number;
  timetableUnitIds: (string | number)[];
  date: string;
  description?: string;
  homeworkId?: string;

  bgColor?: string;
  titleColor?: string;
}
