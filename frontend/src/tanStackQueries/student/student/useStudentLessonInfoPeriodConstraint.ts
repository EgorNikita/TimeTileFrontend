import { useInfiniteQuery } from "@tanstack/vue-query";
import { studentApi, StudentLessonFilters } from "@/services/studentApi";
import { teacherApi } from "@/services/teacherApi";
import { roomApi } from "@/services/roomApi";
import { EnrichedLesson } from "@/types/lesson";
import { ComputedRef, unref } from "vue";
import { PagedList } from "@/common/types/pagedList";
import { subjectApi } from "@/services/subjectApi";
import { courseApi } from "@/services/courseApi";
import { StudentEnrichedLessonInfo } from "@/types/studentLessonsInfo";

export function useStudentLessonInfoPeriodConstraint(
  studentId: string | number,
  filters: StudentLessonFilters | ComputedRef<StudentLessonFilters> = {},
  pageSize = 6,
) {
  return useInfiniteQuery({
    queryKey: [
      "useStudentLessonInfoPeriodConstraint",
      studentId,
      filters,
    ] as const,

    queryFn: async ({ pageParam = 1 }) => {
      try {
        const filtersValue = unref(filters);

        const lessonPage = await studentApi.fetchStudentLessonsInfo(studentId, {
          entity: filtersValue,
          page: pageParam,
          pageSize,
        });
        const lessonsInfo = lessonPage.items;

        const subjectIds = Array.from(
          new Set(lessonsInfo.map((l) => l.lesson.subjectId).filter(Boolean)),
        );
        const courseIds = Array.from(
          new Set(lessonsInfo.map((l) => l.lesson.courseId).filter(Boolean)),
        );
        const teacherIds = Array.from(
          new Set(lessonsInfo.map((l) => l.lesson.teacherId).filter(Boolean)),
        );
        const roomIds = Array.from(
          new Set(lessonsInfo.map((l) => l.lesson.classroomId).filter(Boolean)),
        );

        const [subjects, courses, teachers, rooms] = await Promise.all([
          subjectApi.fetchSubjectsByIds(subjectIds),
          courseApi.fetchCoursesByIds(courseIds),
          teacherApi.fetchTeachersByIds(teacherIds),
          roomApi.fetchRoomsByIds(roomIds),
        ]);

        const enrichedLessonsInfo: StudentEnrichedLessonInfo[] = lessonsInfo
          .map((lessonInfo) => {
            const subject = subjects.find(
              (subj) => subj.id === lessonInfo.lesson.subjectId,
            );
            const course = courses.find(
              (crs) => crs.id === lessonInfo.lesson.courseId,
            );
            const teacher = teachers.find(
              (tch) => tch.id === lessonInfo.lesson.teacherId,
            );
            const room = rooms.find(
              (rm) => rm.id === lessonInfo.lesson.classroomId,
            );

            if (!subject || !course || !teacher || !room) {
              console.warn("Missing data for lesson enrichment.", {
                lessonInfo,
                subject,
                course,
                teacher,
                room,
              });
              return null;
            }

            const enrichedLesson: EnrichedLesson = {
              ...lessonInfo.lesson,
              subject,
              course,
              teacher,
              room,
            };

            return { ...lessonInfo, lesson: enrichedLesson };
          })
          .filter((item): item is StudentEnrichedLessonInfo => item !== null);

        return {
          items: enrichedLessonsInfo,
          page: lessonPage.page,
          pageSize: lessonPage.pageSize,
          totalCount: lessonPage.totalCount,
          totalPages: lessonPage.totalPages,
        };
      } catch (error) {
        console.error("Failed to fetch or process lesson info:", error);
        throw error;
      }
    },

    getNextPageParam: (
      lastPage: PagedList<StudentEnrichedLessonInfo>,
      allPages: PagedList<StudentEnrichedLessonInfo>[],
    ) => {
      const total = lastPage.totalCount;
      const nextPage = allPages.length + 1;
      return (nextPage - 1) * pageSize < total ? nextPage : undefined;
    },

    staleTime: 1000 * 60 * 15,
    initialPageParam: 1,
  });
}
