import { Room } from "@/types/room";
import { Teacher } from "@/types/teacher";
import { Subject } from "@/types/subject";
import { Course } from "@/types/course";

export interface LessonStatus {
  id: number;
  description: string;
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
  classroomId: number;
  lessonStatusId: number;
  timetableUnitIds: (string | number)[];
  date: Date;
  description?: string;
  assigmentId?: string;

  bgColor?: string;
  titleColor?: string;
}

export interface EnrichedLesson extends Lesson {
  course: Course;
  subject: Subject;
  teacher: Teacher;
  room: Room;
}

export interface LessonStatusFilters {}
