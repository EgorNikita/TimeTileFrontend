export interface Grade {
  id: number;
  value: number;
  weight: number;
  type: GradeType;
  date: string;
  subjectId: number;
  courseId: number;
}

enum GradeType {
  Exam = "Exam",
  Classwork = "Classwork",
  Homework = "Homework",
}

export interface GradeFilters {
  coursesIds?: number[];
  studentIds?: number[];
  lessonIds?: number[];
}
