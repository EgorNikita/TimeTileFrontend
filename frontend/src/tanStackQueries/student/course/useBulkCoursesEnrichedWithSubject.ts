import { useQuery } from "@tanstack/vue-query";
import { computed, ComputedRef, Ref, unref } from "vue";
import { Course, courseApi } from "@/services/courseApi";
import { Subject, subjectApi } from "@/services/subjectApi";

export interface CourseEnrichedWithSubject {
  course: Course;
  subject: Subject;
}

export const useBulkCoursesEnrichedWithSubject = (
  ids: ComputedRef<number[]> | Ref<number[]> | number[],
) => {
  const idsRef = computed(() => {
    const idsValue = unref(ids);
    return idsValue.filter((id) => id != null && id > 0);
  });

  return useQuery({
    queryKey: ["bulk-courses", ids],

    queryFn: async () => {
      const courses = await courseApi.fetchCoursesByIds(idsRef.value);
      const subjects = await subjectApi.fetchSubjectsByIds(
        courses.map((c) => c.subjectId),
      );

      const subjectMap = new Map(subjects.map((s) => [s.id, s]));

      return courses.map((course) => ({
        course,
        subject: subjectMap.get(course.subjectId)!,
      })) as CourseEnrichedWithSubject[];
    },

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
