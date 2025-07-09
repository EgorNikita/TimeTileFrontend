export interface Course {
  id: number;
  title: string;
  subjectId: number;
  teacherId: number;
  isAdvanced: boolean;
  termId: number;
  iconUrl: string;
}

export interface CourseFilters {
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
}
