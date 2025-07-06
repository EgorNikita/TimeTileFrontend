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
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
}

export interface GradeListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
  lessonIds?: number[];
  studentIds?: number[];
  courseIds?: number[];
  types?: GradeType[];
}
