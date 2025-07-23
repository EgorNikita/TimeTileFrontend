export interface Grade {
  id: number;
  value: number;
  weight: number;
  type: GradeType;
  date: string;
  subjectId: number;
  courseId: number;
  lessonId?: number;
}

export enum GradeType {
  TermMark = "TermMark",
  Classwork = "Classwork",
  Homework = "Homework",
}

export interface GradeFilters {
  coursesIds?: number[];
  studentIds?: number[];
  lessonIds?: number[];
}
