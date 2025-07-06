export interface Grade {
  id: number;
  value: number;
  weight: number;
  type: GradeType;
  date: string;
  subjectId: number;
  courseId: number;
}

export interface GradeFilters {
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
}
