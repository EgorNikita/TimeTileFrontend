<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Sticky weekday headers with rounded top corners -->
    <div
      class="sticky top-[64px] z-30 grid lg:grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[50px_repeat(7,1fr)] divide-x divide-gray-200 rounded-t-lg shadow-sm"
    >
      <!-- Time column header -->
      <div class="bg-white rounded-tl-lg border-r border-gray-200" />

      <!-- Weekday headers -->
      <div
        v-for="(day, index) in weekDays"
        :key="`header-${index}`"
        class="flex bg-white items-center justify-center py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        :class="index === weekDays.length - 1 ? 'rounded-tr-lg' : ''"
        @click="handleHeaderClick(day)"
      >
        <span class="flex items-baseline">
          <span class="text-sm font-medium text-gray-700">{{ day.full }}</span>
          <span
            :class="[
              'ml-2 flex items-center justify-center font-semibold text-sm w-7 h-7 rounded-full transition-colors',
              day.isToday
                ? 'text-white bg-indigo-600'
                : 'text-gray-900 hover:bg-gray-100',
            ]"
          >
            {{ day.date }}
          </span>
        </span>
      </div>
    </div>

    <!-- Timetable body -->
    <div class="relative flex-1 overflow-auto">
      <div
        class="grid lg:grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[50px_repeat(7,1fr)] divide-x divide-y divide-gray-200 min-h-full"
        :style="{
          gridTemplateRows: gridTemplateRows,
          gridAutoFlow: 'row dense',
        }"
      >
        <!-- Timetable grid cells with explicit positioning -->
        <template
          v-for="(unit, unitIndex) in timetableData"
          :key="`unit-${unit.id}`"
        >
          <!-- Time slot label -->
          <div
            class="flex flex-col h-full items-center justify-center px-2 py-2 text-xs border-r border-gray-200 sticky left-0 z-10"
            :class="[
              unit.isBreak
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white text-gray-600',
            ]"
            :style="{
              gridColumn: 1,
              gridRow: unitIndex + 1,
            }"
          >
            <div
              class="flex-1 flex items-center justify-center self-start mt-1 text-gray-400 leading-tight text-center"
            >
              {{ formatTime(unit.startTime) }}
            </div>
            <div
              class="flex-1 flex flex-col items-center justify-center font-semibold text-center leading-tight"
            >
              <div class="mt-0.5 text-xs">
                {{ unit.title }}
              </div>
              <div v-if="unit.isBreak" class="mt-0.5 text-xs text-gray-300">
                {{ Math.round(unit.duration) }}min
              </div>
            </div>
            <div
              class="flex-1 flex items-center justify-center self-end mt-1 text-gray-400 leading-tight text-center"
            >
              {{ formatTime(unit.endTime) }}
            </div>
          </div>

          <!-- Day cells for each unit -->
          <div
            v-for="(day, dayIndex) in weekDays"
            :key="`cell-${unit.id}-${dayIndex}`"
            class="relative min-h-[60px] transition-colors duration-150"
            :class="[
              unit.isBreak
                ? 'bg-gray-10'
                : day.isToday
                  ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer'
                  : 'bg-white hover:bg-gray-50 cursor-pointer',
            ]"
            :style="{
              gridColumn: dayIndex + 2,
              gridRow: unitIndex + 1,
            }"
            @click="!unit.isBreak && handleCellClick(day, unit)"
          >
            <!-- Break indicator -->
            <div
              v-if="unit.isBreak"
              class="absolute inset-0 flex items-center justify-center"
            ></div>
          </div>
        </template>

        <!-- Events placed in correct grid position -->
        <template v-for="event in processedEvents" :key="`event-${event.id}`">
          <div
            class="z-20 rounded-lg p-3 text-sm font-medium shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 m-1"
            :class="[
              event.bgColor || 'bg-blue-500',
              event.titleColor || 'text-white',
              'hover:opacity-90',
            ]"
            :style="{
              gridColumn: event.dayIndex + 2,
              gridRow: `${event.gridRowStart + 1} / span ${event.rowSpan}`,
            }"
            @click="handleEventClick(event, $event)"
          >
            <div class="font-semibold truncate text-sm">
              {{ event.subject }}
            </div>
            <div class="text-xs opacity-90 mt-1 truncate">
              {{ formatEventTime(event.startTime) }} -
              {{ formatEventTime(event.endTime) }}
            </div>
            <div v-if="event.room" class="text-xs opacity-80 mt-1 truncate">
              📍 {{ event.room }}
            </div>
            <div v-if="event.units.length > 1" class="text-xs opacity-70 mt-1">
              {{ event.units.length }} units
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { TimetableUnit, Lesson } from "@/types/lesson";

interface WeekDay {
  short: string;
  full: string;
  date: number;
  fullDate: Date;
  isToday: boolean;
}

interface ProcessedEvent extends Lesson {
  dayIndex: number;
  gridRowStart: number;
  rowSpan: number;
  startTime: string;
  endTime: string;
  units: TimetableData[];
}

interface TimetableData extends TimetableUnit {
  duration: number;
  startMinutes: number;
  endMinutes: number;
  isBreak: boolean;
}

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
  "day-click": [payload: { day: WeekDay; unit: TimetableData }];
  "event-click": [event: ProcessedEvent];
  "header-click": [day: WeekDay];
  "cell-click": [payload: { day: WeekDay; unit: TimetableData }];
}

const emit = defineEmits<Emits>();

// Refs
const containerNav = ref<HTMLElement | null>(null);

// Utility functions
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
};

const formatEventTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
};

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

const processedEvents = computed((): ProcessedEvent[] => {
  return props.lessons
    .map((event): ProcessedEvent | null => {
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

// Event handlers
const handleCellClick = (day: WeekDay, unit: TimetableData): void => {
  emit("cell-click", { day, unit });
};

const handleEventClick = (event: ProcessedEvent, nativeEvent: Event): void => {
  nativeEvent.stopPropagation();
  emit("event-click", event);
};

const handleHeaderClick = (day: WeekDay): void => {
  emit("header-click", day);
};

// Legacy handler for backward compatibility
const handleDayClick = (day: WeekDay, unit: TimetableData): void => {
  emit("day-click", { day, unit });
};

// Expose for template ref access
defineExpose({
  containerNav,
  timetableData,
  totalDuration,
  gridTemplateRows,
  weekDays,
  processedEvents,
  timeToMinutes,
  formatTime,
  formatEventTime,
});
</script>
