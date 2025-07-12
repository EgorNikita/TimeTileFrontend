interface TimetableUnit {
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
  subject: string;
  teacher: string;

  room: string;
  status: LessonStatus;
  timetableUnitIds: (string | number)[];
  date: string;
  description?: string;
  homeworkId?: string;

  bgColor?: string;
  titleColor?: string;
}
