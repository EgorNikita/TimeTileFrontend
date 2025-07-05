// stores/courseCache.ts
import { CourseDto } from "@/types/course";

const _courseCache = new Map<number, CourseDto>();

export const courseCache = {
  get: (id: number): CourseDto | undefined => _courseCache.get(id),
  set: (course: CourseDto) => _courseCache.set(course.id, course),
  delete: (id: number) => _courseCache.delete(id),
  clear: () => _courseCache.clear(),
  getAll: (): CourseDto[] => Array.from(_courseCache.values()),
  has: (id: number): boolean => _courseCache.has(id),
};
