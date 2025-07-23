export interface StudentCourseInfo {
  courseId: number;
  course: CourseInfo;
  gradeId: number | null;
  positionX: number;
  positionY: number;
  averageGrade: number;
}

export interface EnrichedStudentCourseInfo extends StudentCourseInfo {
  subjectTitle: string;
  termMark: number | null;
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
  GradeId?: number | null;
  PositionX?: number;
  PositionY?: number;
}

// export interface CourseCard extends StudentCourseInfo {
//   id: number;
//   courseTitle: string;
//   subjectTitle: string;
//   termMark?: number;
// }
