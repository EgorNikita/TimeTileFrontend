export interface Course {
  id: number;
  title: string;
  subjectId: number;
  teacherId: number;
  isAdvanced: boolean;
  termId: number;
  iconUrl: string;
}

export interface PagedList<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CourseFilters {
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
}

export interface CourseListParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
}
