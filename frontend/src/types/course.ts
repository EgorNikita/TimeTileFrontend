import { EntityWithIcon } from "@/services/common/serviceUtils";

export interface Course extends EntityWithIcon {
  id: number;
  title: string;
  subjectId: number;
  teacherId: number;
  isAdvanced: boolean;
  termId: number;
}

export interface CourseFilters {
  subjectIds?: number[];
  teacherIds?: number[];
  termIds?: number[];
  studentIds?: number[];
  groupIds?: number[];
}
