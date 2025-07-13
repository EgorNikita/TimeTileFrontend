<script setup lang="ts">
import { computed, ref } from "vue";
import { TimetableUnit, Lesson } from "@/types/lesson";
import WeekView from "@/components/common/timetable/WeekView.vue";
import {
  ProcessedLesson,
  TimetableData,
  WeekDay,
} from "@/components/common/timetable/timetableInterfaces";
import { timeToMinutes } from "@/components/common/timetable/timetableUtils";
import DayView from "@/components/common/timetable/DayView.vue";

// Props
interface Props {
  currentDate: Date;
  currentView: string;
  timetableUnits: TimetableUnit[];
  lessons?: Lesson[];
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
  const currentDate = props.currentDate || new Date();
  const dayOffset = currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1;

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - dayOffset);

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
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    console.log(
      `Setting date for ${name.full}: ${date.toDateString()} = ${today.toDateString()}`,
    );
    return {
      ...name,
      date: date.getDate(),
      fullDate: date,
      isToday: date.toDateString() === today.toDateString(),
    };
  });
});

const timetableData = computed((): TimetableData[] => {
  // Sort units by start time to ensure proper ordering
  const sortedUnits = [...props.timetableUnits].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

  const result: TimetableData[] = [];

  for (let i = 0; i < sortedUnits.length; i++) {
    const unit = sortedUnits[i];
    const startMinutes = timeToMinutes(unit.startTime);
    const endMinutes = timeToMinutes(unit.endTime);

    if (i > 0) {
      const prevUnit = sortedUnits[i - 1];
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

const processedEvents = computed((): ProcessedLesson[] => {
  return props.lessons
    .map((event): ProcessedLesson | null => {
      // Parse the event date
      const eventDate = new Date(event.date);

      // Validate date
      if (isNaN(eventDate.getTime())) {
        console.warn(
          `Invalid date format for event: ${event.subject}, date: ${event.date}`,
        );
        return null;
      }

      // Find which day of the week this event falls on
      const dayIndex = weekDays.value.findIndex(
        (day) => day.fullDate.toDateString() === eventDate.toDateString(),
      );

      if (dayIndex === -1) {
        // Event is not in the current week, skip it
        return null;
      }

      // Find the timetable units for this event
      const eventUnits = timetableData.value.filter((unit) =>
        event.timetableUnitIds.includes(unit.id),
      );

      if (eventUnits.length === 0) {
        console.warn(
          `No matching timetable units found for event: ${event.subject}`,
        );
        return null;
      }

      // Sort units by their position in the timetable
      eventUnits.sort((a, b) => a.startMinutes - b.startMinutes);

      // Find the first and last unit indices in the full timetable
      const firstUnitIndex = timetableData.value.findIndex(
        (unit) => unit.id === eventUnits[0].id,
      );
      const lastUnitIndex = timetableData.value.findIndex(
        (unit) => unit.id === eventUnits[eventUnits.length - 1].id,
      );

      if (firstUnitIndex === -1 || lastUnitIndex === -1) {
        console.warn(
          `Could not find unit positions for event: ${event.subject}`,
        );
        return null;
      }

      // Check if units are consecutive (allowing for breaks in between)
      const expectedUnits = timetableData.value.slice(
        firstUnitIndex,
        lastUnitIndex + 1,
      );
      const hasGaps = expectedUnits.some(
        (unit) => !unit.isBreak && !event.timetableUnitIds.includes(unit.id),
      );

      if (hasGaps) {
        console.warn(`Event ${event.subject} has gaps between selected units`);
      }

      return {
        ...event,
        dayIndex,
        gridRowStart: firstUnitIndex,
        rowSpan: lastUnitIndex - firstUnitIndex + 1,
        units: eventUnits,
      };
    })
    .filter((event): event is ProcessedEvent => event !== null);
});

const gridTemplateRows = computed((): string => {
  const minRowHeight = 10; // Minimum row height in pixels
  return timetableData.value
    .map((unit) => {
      const frValue = Math.max((unit.duration / 15) * 0.5, 1);
      return `minmax(${minRowHeight}px, ${frValue}fr)`;
    })
    .join(" ");
});

const totalDuration = computed((): number =>
  timetableData.value.reduce((sum, unit) => sum + unit.duration, 0),
);

// // Event handlers
// const handleCellClick = (day: WeekDay, unit: TimetableData): void => {
//   emit("cell-click", { day, unit });
// };
//
// const handleEventClick = (event: ProcessedEvent, nativeEvent: Event): void => {
//   nativeEvent.stopPropagation();
//   emit("event-click", event);
// };
//
// const handleHeaderClick = (day: WeekDay): void => {
//   emit("header-click", day);
// };

// Expose for template ref access
defineExpose({
  containerNav,
  timetableData,
  totalDuration,
  gridTemplateRows,
  weekDays,
  processedEvents,
});
</script>

<template>
  <div v-if="currentView === 'Week view'" class="flex flex-col h-full">
    <div class="flex-1">
      <WeekView
        :timetableUnits="timetableData"
        :gridTemplateRows="gridTemplateRows"
        :weekDays="weekDays"
        :lessons="processedEvents"
      />
    </div>
  </div>

  <div v-else class="flex flex-col h-full">
    <div class="flex-1">
      <DayView
        :currentDate="currentDate"
        :timetable-units="timetableData"
        :gridTemplateRows="gridTemplateRows"
        :lessons="processedEvents"
        @day-click="(payload) => emit('day-click', payload)"
      />
    </div>
  </div>
</template>
