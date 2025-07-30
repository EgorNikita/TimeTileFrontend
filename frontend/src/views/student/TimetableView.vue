<!-- Main Timetable Component -->
<template>
  <div class="flex flex-col h-full overflow-y-auto">
    <!-- Header -->
    <div class="sticky top-0 z-31 bg-gray-100">
      <TimetableHeader
        :current-date="currentDate"
        :current-view="currentView"
        :views="views"
        @previous="handlePrevious"
        @next="handleNext"
        @today="handleToday"
        @view-change="handleViewChange"
        @add-event="handleAddEvent"
      />
    </div>

    <!-- Timetable Grid Container -->
    <div class="flex-1 m-4 mt-0 bg-white shadow-md rounded-lg overflow-clip">
      <TimetableGrid
        ref="timetableGridRef"
        :currentDate="currentDate"
        :currentView="currentView"
        :timetable-units="timetableUnits"
        :startOfWeek="startOfWeek"
        :lessons="timetableLessons"
        @day-click="handleDayClick"
        @event-click="handleEventClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import TimetableHeader from "@/components/common/timetable/TimetableHeader.vue";
import TimetableGrid from "@/components/common/timetable/TimetableGrid.vue";
import { timeToMinutes } from "@/components/common/timetable/timetableUtils";
import {
  VIEW_WEEK,
  VIEWS,
  ViewType,
} from "@/components/common/timetable/timetableConstants";
import { useTimetableUnits } from "@/tanStackQueries/student/timetableUnit/useTimetableUnits";
import { useStudentLessonInfoPeriodConstraint } from "@/tanStackQueries/student/student/useStudentLessonInfoPeriodConstraint";
import { useLessonStatuses } from "@/tanStackQueries/student/lesson/useLessonStatuses";
import { TimetableLesson } from "@/components/common/timetable/timetableInterfaces";
import { useAuth } from "@/composables/useAuth";

// Refs
const container = ref<HTMLElement | null>(null);
const timetableGridRef = ref<InstanceType<typeof TimetableGrid> | null>(null);

// Date and View State
const currentDate = ref<Date>(
  (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })(),
);

const currentView = ref<ViewType>(VIEW_WEEK);
const views = ref<ViewType[]>([...VIEWS]);

// Timetable Units
const timetableUnitsQuery = useTimetableUnits({ fetchAll: true });
const timetableUnits = computed(() => {
  return timetableUnitsQuery.data?.value ?? [];
});

// Lesson Statuses
const lessonStatusesQuery = useLessonStatuses({});
const lessonStatuses = computed(() => {
  return lessonStatusesQuery.data?.value ?? [];
});

// Date Range
const startOfWeek = computed(() => {
  const date = currentDate.value;
  const dayOffset = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const start = new Date(date);
  start.setDate(date.getDate() - dayOffset);
  return start;
});

const fetchLessonFilters = computed(() => ({
  from: startOfWeek.value.toDateString(),
  until: new Date(
    startOfWeek.value.getTime() + 6 * 24 * 60 * 60 * 1000,
  ).toDateString(),
  fetchAll: true,
}));

// Lessons
const { user } = useAuth();
const lessonsQuery = useStudentLessonInfoPeriodConstraint(
  user.currentUser.value?.id!,
  fetchLessonFilters,
);
const lessons = computed(
  () => lessonsQuery.data.value?.pages?.flatMap((page) => page.items) ?? [],
);

const timetableLessons = computed((): TimetableLesson[] => {
  return lessons.value
    .map((lesson) => {
      const status = lessonStatuses.value.find(
        (s) => s.id === lesson.lesson.lessonStatusId,
      );
      return status ? { ...lesson, status } : null;
    })
    .filter((lesson): lesson is TimetableLesson => lesson !== null);
});

// Auto-scroll to current time
const scrollToCurrentTime = (): void => {
  if (!container.value || timetableUnits.value.length === 0) return;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = timeToMinutes(timetableUnits.value[0].startTime);
  const end = timeToMinutes(
    timetableUnits.value[timetableUnits.value.length - 1].endTime,
  );

  if (currentMinutes >= start && currentMinutes <= end) {
    const progress = (currentMinutes - start) / (end - start);
    const maxScroll =
      container.value.scrollHeight - container.value.clientHeight;
    container.value.scrollTop = progress * maxScroll;
  }
};

onMounted(() => {
  setTimeout(() => {
    scrollToCurrentTime();
  }, 100);
});

watch(currentDate, () => {
  setTimeout(() => {
    scrollToCurrentTime();
  }, 100);
});

// Handlers
const changeDateBy = (days: number): void => {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + days);
  currentDate.value = newDate;
};

const handlePrevious = () =>
  changeDateBy(currentView.value === VIEW_WEEK ? -7 : -1);
const handleNext = () => changeDateBy(currentView.value === VIEW_WEEK ? 7 : 1);
const handleToday = () => (currentDate.value = new Date());
const handleViewChange = (view: ViewType) => {
  if (VIEWS.includes(view)) currentView.value = view;
};
const handleAddEvent = () => console.log("Add event clicked");
const handleDayClick = (payload: { date: Date }) =>
  (currentDate.value = payload.date);
const handleEventClick = (event: Event) => console.log("Event clicked:", event);
</script>
