<script setup lang="ts">
import {computed, ref} from "vue";
import {useStudentLessonInfo} from "@/tanStackQueries/student/student/useStudentLessonInfo";
import {useAuthStore} from "@/store/modules/auth";
import {useStudentAttendanceCount} from "@/tanStackQueries/student/student/useStudentAttendanceCount";
import {GradeType} from "@/types/grade";
import {useIncrementalGrades} from "@/tanStackQueries/student/grades/useIncrementalGrades";

const scrollContainer = ref<HTMLElement | null>(null);

interface Lesson {
  id: number;
  description: string;
  date: string;
  classworkGrade?: number;
  homeworkGrade?: number;
}

interface Grade {
  id: number;
  value: number;
  type: GradeType;
}

const props = defineProps<{
  courseId: number;
}>();

const auth = useAuthStore();
const userId = auth.userId!;

const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useStudentLessonInfo(userId, {
  courseIds: [props.courseId]
});

const lessonsToStudents = computed(
  () =>
    data.value?.pages?.flatMap((page) => page.items) ??
    []
)

const attendanceCount = useStudentAttendanceCount(userId, {
  courseIds: [props.courseId]
});

const completedLessons = computed(
    () => attendanceCount.data.value?.attendedLessons ?? 0
);

const totalLessons = computed(
    () => attendanceCount.data.value?.totalLessons ?? 0
);

const lessonIds = computed(() =>
    [...new Set(lessonsToStudents.value.map((lessonToStudent) => lessonToStudent.lessonId))]
)

const gradesQuery = useIncrementalGrades(() => lessonIds.value);

const lessonGradesMap = computed(() => {
  const map = new Map<number, Array<Grade>>();
  if (gradesQuery) {
    const grades = gradesQuery.data?.value ?? [];

    grades.forEach((grade) => {
      const current = map.get(grade.lessonId!) ?? [];
      current.push(grade);
      map.set(grade.lessonId!, current);
    });
  }
  return map;
});

const lessons = computed<Lesson[]>(
  () => lessonsToStudents.value.map(lessonToStudent => {
    const grades = lessonGradesMap.value.get(lessonToStudent.lessonId);

    let classworkGrade: number | undefined;
    let homeworkGrade: number | undefined;

    if (grades) {
      classworkGrade = grades.find(g => g.type == GradeType.Classwork)?.value;
      homeworkGrade = grades.find(g => g.type == GradeType.Homework)?.value;
    }

    return {
      id: lessonToStudent.lessonId,
      description: lessonToStudent.lesson.description,
      date: lessonToStudent.lesson.date,
      classworkGrade,
      homeworkGrade
    }
  }
));

const handleScroll = () => {
  const el = scrollContainer.value;
  if (!el || !hasNextPage.value || isFetchingNextPage.value) return;

  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

  if (nearBottom) {
    fetchNextPage();
  }
};

const getProgressPercentage = (completed: number, total: number): number => {
  return Math.round((completed / total) * 100);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div class="mb-6">
    <div class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700">Progress</span>
      <span class="text-sm text-gray-600">
        {{ completedLessons }}/{{ totalLessons }} lessons
      </span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3">
      <div
        class="bg-stone-800 h-3 rounded-full transition-all duration-500"
        :style="`width: ${getProgressPercentage(completedLessons, totalLessons)}%`"
      ></div>
    </div>
    <div class="text-right text-sm text-gray-600 mt-1">
      {{ getProgressPercentage(completedLessons, totalLessons) }}% Complete
    </div>
  </div>

  <div class="mt-4">
    <h3 class="text-sm font-semibold text-gray-700 mb-1">Lessons</h3>
    <ul
      ref="scrollContainer"
      class="space-y-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar"
      @scroll="handleScroll"
    >
      <li
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        class="text-sm text-gray-400 border-b py-2"
      >
        <!-- Lesson Header -->
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center space-x-3">
            <div
              class="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600 shadow-sm"
            >
              {{ index + 1 }}
            </div>
            <div>
              <h4
                class="font-semibold text-gray-800 truncate max-w-xs overflow-hidden whitespace-nowrap"
              >
                {{ lesson.description }}
              </h4>
              <p class="text-sm text-gray-500">{{ formatDate(lesson.date) }}</p>
            </div>
          </div>
        </div>

        <!-- Grades -->
        <div class="flex space-x-2 mt-3">
          <div class="flex items-center space-x-1">
            <span class="text-md text-gray-600">Classwork:</span>
            <span
              class="px-2 py-0.5 rounded-sm text-md font-medium text-green-600 bg-green-100"
            >
              {{ lesson.classworkGrade ?? "-" }}
            </span>
          </div>
          <div class="flex items-center space-x-1">
            <span class="text-md text-gray-600">Homework:</span>
            <span
              :class="`px-2 py-0.5  rounded-md text-md font-medium text-blue-600 bg-blue-100`"
            >
              {{ lesson.homeworkGrade ?? "-" }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
