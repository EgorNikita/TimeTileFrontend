import { StudentCourseInfo } from "@/services/studentApi";

export interface EnrichedStudentCourseInfo extends StudentCourseInfo {
  subjectTitle: string;
  termMark: number | null;
}
