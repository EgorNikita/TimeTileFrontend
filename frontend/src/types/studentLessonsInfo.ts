import { EnrichedLesson } from "@/types/lesson";
import {
  BaseStudentLessonInfo,
  StudentLessonInfo,
} from "@/services/studentApi";
import { Grade } from "@/services/gradeApi";

export interface StudentEnrichedLessonInfo extends BaseStudentLessonInfo {
  lesson: EnrichedLesson;
}

export interface StudentLessonInfoWithGrades extends StudentLessonInfo {
  homeworkGrade?: Grade;
  classworkGrade?: Grade;
}
