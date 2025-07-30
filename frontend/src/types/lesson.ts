import { Course } from "@/services/courseApi";
import { Subject } from "@/services/subjectApi";
import { Lesson } from "@/services/lessonApi";
import { Teacher } from "@/services/teacherApi";
import { Room } from "@/services/roomApi";

export interface EnrichedLesson extends Lesson {
  course: Course;
  subject: Subject;
  teacher: Teacher;
  room: Room;
}
