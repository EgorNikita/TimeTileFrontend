export interface StudentCourseInfo {
  courseId: number;
  course: CourseInfo;
  examGradeId: number | null;
  hasExam: boolean;
  positionX: number;
  positionY: number;
  averageGrade: number;
}

interface CourseInfo {
  id: number;
  title: string;
  subjectId: number;
  teacherId: number;
  isAdvanced: boolean;
  termId: number;
  iconUrl: string;
}

export interface StudentCourseFilters {
  termIds?: number[];
  CourseId?: number;
  ExamGradeId?: number | null;
  HasExam?: boolean;
  PositionX?: number;
  PositionY?: number;
}
