import { SubjectDto } from "@/types/subject";

const _subjectCache = new Map<number, SubjectDto>();

export const subjectCache = {
  get: (id: number): SubjectDto | undefined => _subjectCache.get(id),
  set: (course: SubjectDto) => _subjectCache.set(course.id, course),
  delete: (id: number) => _subjectCache.delete(id),
  clear: () => _subjectCache.clear(),
  getAll: (): SubjectDto[] => Array.from(_subjectCache.values()),
  has: (id: number): boolean => _subjectCache.has(id),
};