import { useQuery } from "@tanstack/vue-query";
import { fetchStudentLessonsInfo } from "@/services/studentService";
import {
  StudentEnrichedLessonInfo,
  StudentLessonFilters,
} from "@/types/studentLessonsInfo";
import { fetchSubjectsByIds } from "@/services/subjectService";
import { fetchCoursesByIds } from "@/services/courseService";
import { fetchTeachersByIds } from "@/services/teacherService";
import { fetchRoomsByIds } from "@/services/roomService";
import { EnrichedLesson } from "@/types/lesson";
import { ComputedRef, unref } from "vue";

export function useStudentLessonInfoPeriodConstraint(
  studentId: string | number,
  filters: StudentLessonFilters | ComputedRef<StudentLessonFilters> = {},
) {
  return useQuery({
    queryKey: [
      "useStudentLessonInfoPeriodConstraint",
      studentId,
      filters,
    ] as const,

    queryFn: async () => {
      try {
        const filtersValue = unref(filters);

        console.log(
          "Fetching lessons for student:",
          studentId,
          "with filters:",
          filtersValue,
        );

        const lessonPage = await fetchStudentLessonsInfo(studentId, {
          entity: filtersValue,
        });
        const lessonsInfo = lessonPage.items;

        console.log("Fetched Lessons Info:", lessonsInfo);

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
          fetchSubjectsByIds(subjectIds),
          fetchCoursesByIds(courseIds),
          fetchTeachersByIds(teacherIds),
          fetchRoomsByIds(roomIds),
        ]);

        console.log("Fetched Subjects:", subjects);

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

        console.log("Enriched Lessons Info:", enrichedLessonsInfo);

        return enrichedLessonsInfo;
      } catch (error) {
        console.error("Failed to fetch or process lesson info:", error);
        throw error;
      }
    },

    staleTime: 1000 * 60 * 15,
  });
}
