<script setup lang="ts">
import { computed, ref, watch } from "vue";
import WeekView from "@/components/common/timetable/WeekView.vue";
import {
  ProcessedLesson,
  TimetableData,
  TimetableLesson,
  WeekDay,
} from "@/components/common/timetable/timetableInterfaces";
import { timeToMinutes } from "@/components/common/timetable/timetableUtils";
import DayView from "@/components/common/timetable/DayView.vue";
import { TimetableUnit } from "@/services/timetableApi";

// Props
interface Props {
  currentDate: Date;
  startOfWeek: Date;
  currentView: string;
  timetableUnits: TimetableUnit[];
  lessons: TimetableLesson[];
}
const props = withDefaults(defineProps<Props>(), {
  lessons: () => [],
});

// Emits
interface Emits {
  "day-click": [payload: { date: Date }];
  "header-click": [day: WeekDay];
  "cell-click": [payload: { day: WeekDay; unit: TimetableData }];
}

const emit = defineEmits<Emits>();

// Refs
const containerNav = ref<HTMLElement | null>(null);

// Computed properties
const weekDays = computed((): WeekDay[] => {
  const today = new Date();

  const dayNames = [
    { short: "M", full: "Mon" },
    { short: "T", full: "Tue" },
    { short: "W", full: "Wed" },
    { short: "Th", full: "Thu" },
    { short: "F", full: "Fri" },
    { short: "Sa", full: "Sat" },
    { short: "Su", full: "Sun" },
  ];

  return dayNames.map((name, i) => {
    const date = new Date(props.startOfWeek);
    date.setDate(props.startOfWeek.getDate() + i);
    return {
      ...name,
      date: date.getDate(),
      fullDate: date,
      isToday: date.toDateString() === today.toDateString(),
    };
  });
});

const timetableData = computed((): TimetableData[] => {
  const result: TimetableData[] = [];

  for (let i = 0; i < props.timetableUnits.length; i++) {
    const unit = props.timetableUnits[i];
    const startMinutes = timeToMinutes(unit.startTime);
    const endMinutes = timeToMinutes(unit.endTime);

    if (i > 0) {
      const prevUnit = props.timetableUnits[i - 1];
      const prevEndMinutes = timeToMinutes(prevUnit.endTime);

      if (startMinutes > prevEndMinutes) {
        result.push({
          id: `break-${prevUnit.id}-${unit.id}`,
          title: "Break",
          startTime: prevUnit.endTime,
          endTime: unit.startTime,
          duration: startMinutes - prevEndMinutes,
          startMinutes: prevEndMinutes,
          endMinutes: startMinutes,
          isBreak: true,
        });
      }
    }

    result.push({
      ...unit,
      duration: endMinutes - startMinutes,
      startMinutes,
      endMinutes,
      isBreak: false,
    });
  }

  return result;
});

const processedLessons = computed((): ProcessedLesson[] => {
  return props.lessons
    .map((studentLessonInfo) => {
      const dayIndex = weekDays.value.findIndex(
        (day) =>
          day.fullDate.toDateString() ===
          new Date(studentLessonInfo.lesson.date).toDateString(),
      );

      if (dayIndex === -1) {
        return null;
      }

      const units = timetableData.value.filter((unit) =>
        studentLessonInfo.lesson.timetableUnitIds?.includes(unit.id),
      );

      const timetableUnitId = units[0]?.id;
      // otherwise lesson will be displayed on break's row
      const gridRowStart =
        timetableData.value.findIndex((unit) => unit.id === timetableUnitId) +
        1;
      const rowSpan = units.length;

      console.log("Unit", units[0]?.title);

      return {
        ...studentLessonInfo,
        units,
        dayIndex,
        gridRowStart,
        rowSpan,
      };
    })
    .filter((lesson): lesson is ProcessedLesson => lesson !== null);
});

const currentDayLessons = computed(() => {
  return processedLessons.value.filter(
    (lesson) =>
      new Date(lesson.lesson.date).toDateString() ===
      props.currentDate.toDateString(),
  );
});

watch(
  () => props.lessons,
  (newVal) => {
    console.log("timetableLessons:", newVal);
  },
  { deep: true, immediate: true },
);

watch(
  () => processedLessons.value,
  (newVal) => {
    console.log("processedLessons:", newVal);
  },
  { deep: true, immediate: true },
);

const gridTemplateRows = computed((): string => {
  const minRowHeight = 10; // Minimum row height in pixels
  return timetableData.value
    .map((unit) => {
      const frValue = Math.max((unit.duration / 15) * 0.5, 1);
      return `minmax(${minRowHeight}px, ${frValue}fr)`;
    })
    .join(" ");
});
</script>

<template>
  <div v-if="currentView === 'Week view'" class="flex flex-col h-full">
    <div class="flex-1">
      <WeekView
        :timetableUnits="timetableData"
        :gridTemplateRows="gridTemplateRows"
        :weekDays="weekDays"
        :lessonInfos="processedLessons"
      />
    </div>
  </div>

  <div v-else class="flex flex-col h-full">
    <div class="flex-1">
      <DayView
        :currentDate="currentDate"
        :timetable-units="timetableData"
        :gridTemplateRows="gridTemplateRows"
        :lessonInfos="currentDayLessons"
        @day-click="(payload) => emit('day-click', payload)"
      />
    </div>
  </div>
</template>
