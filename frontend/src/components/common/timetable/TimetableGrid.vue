<template>
  <div class="flex flex-col h-full">
    <!-- Sticky weekday headers with rounded top corners -->
    <div
      class="sticky top-[64px] z-31 grid lg:grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[50px_repeat(7,1fr)] border-b-2 border-gray-200 divide-x divide-gray-100 rounded-t-lg"
    >
      <!-- Time column header -->
      <div class="bg-white rounded-tl-lg" />

      <!-- Weekday headers -->
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        class="flex bg-white items-center justify-center py-3 cursor-pointer hover:bg-gray-50"
        :class="index === weekDays.length - 1 ? 'rounded-tr-lg' : ''"
      >
        <span class="flex items-baseline">
          {{ day.full }}
          <span
            :class="[
              'ml-1.5 flex items-center justify-center font-semibold size-8',
              day.isToday
                ? 'text-white bg-indigo-600 rounded-full'
                : 'text-gray-900',
            ]"
          >
            {{ day.date }}
          </span>
        </span>
      </div>
    </div>

    <!-- Timetable body -->
    <div class="relative flex-1">
      <div
        class="grid lg:grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[50px_repeat(7,1fr)] divide-x divide-y divide-gray-100"
        :style="{
          gridTemplateRows,
          gridAutoFlow: 'row dense',
        }"
      >
        <!-- Timetable grid cells with explicit positioning -->
        <template v-for="(unit, unitIndex) in timetableData" :key="unit.id">
          <!-- Time slot label -->
          <div
            class="flex flex-col items-center justify-center px-2 py-1 text-xs"
            :class="
              unit.isBreak
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white text-gray-600'
            "
            :style="{
              gridColumn: 1,
              gridRow: unitIndex + 1,
            }"
          >
            <div class="font-semibold text-center">{{ unit.title }}</div>
            <div class="mt-0.5 text-gray-400 leading-tight">
              {{ unit.startTime }} - {{ unit.endTime }}
            </div>
          </div>
          <!-- Day cells for each unit with explicit positioning -->
          <div
            v-for="(day, dayIndex) in weekDays"
            :key="`${unit.id}-${dayIndex}`"
            class="relative min-h-[60px]"
            :class="unit.isBreak ? 'bg-gray-50' : 'bg-white'"
            :style="{
              gridColumn: dayIndex + 2,
              gridRow: unitIndex + 1,
            }"
            @click="handleDayClick(day, unit)"
          />
        </template>

        <!-- Events placed in correct grid position -->
        <template v-for="event in processedEvents" :key="event.id">
          <div
            class="z-10 rounded-md p-2 text-sm font-medium shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-lg m-1"
            :class="[
              event.bgColor || 'bg-blue-500',
              event.titleColor || 'text-white',
            ]"
            :style="{
              gridColumn: event.dayIndex + 2,
              gridRow: `${event.gridRowStart + 1} / span ${event.rowSpan}`,
            }"
            @click="handleEventClick(event)"
          >
            <div class="font-semibold truncate">{{ event.title }}</div>
            <div class="text-xs opacity-90 mt-1 truncate">
              {{ formatEventTime(event.startTime) }} -
              {{ formatEventTime(event.endTime) }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps({
  timetableUnits: {
    type: Array,
    required: true,
    default: () => [],
  },
  events: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["day-click", "event-click"]);

const containerNav = ref(null);

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const weekDays = computed(() => {
  const today = new Date();
  const dayOffset = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOffset);

  const dayNames = [
    { short: "M", full: "Mon" },
    { short: "T", full: "Tue" },
    { short: "W", full: "Wed" },
    { short: "T", full: "Thu" },
    { short: "F", full: "Fri" },
    { short: "S", full: "Sat" },
    { short: "S", full: "Sun" },
  ];

  return dayNames.map((name, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return {
      ...name,
      date: date.getDate(),
      fullDate: date,
      isToday: date.toDateString() === today.toDateString(),
    };
  });
});

const timetableData = computed(() => {
  return props.timetableUnits.map((unit) => ({
    ...unit,
    duration: timeToMinutes(unit.endTime) - timeToMinutes(unit.startTime),
    startMinutes: timeToMinutes(unit.startTime),
    endMinutes: timeToMinutes(unit.endTime),
    isBreak: unit.title === "Break",
  }));
});

const processedEvents = computed(() => {
  return props.events
    .map((event) => {
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);

      const eventDate = new Date(event.startTime);
      const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
      const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();

      const dayIndex = weekDays.value.findIndex(
        (day) => day.fullDate.toDateString() === eventDate.toDateString(),
      );

      if (dayIndex < 0) return null;

      console.log(
        `Processing event ${event.title} on day index ${dayIndex} with start ${startMinutes} and end ${endMinutes}`,
      );

      const startUnitIndex = timetableData.value.findIndex(
        (unit) =>
          startMinutes >= unit.startMinutes && startMinutes < unit.endMinutes,
      );

      const endUnitIndex = timetableData.value.findLastIndex(
        (unit) =>
          endMinutes > unit.startMinutes && endMinutes <= unit.endMinutes,
      );

      console.log(
        `Event ${event.title} starts at unit ${startUnitIndex} and ends at unit ${endUnitIndex}`,
      );

      if (startUnitIndex < 0 || endUnitIndex < 0) return null;

      console.log(
        `Event ${event.title} spans from unit ${startUnitIndex} to ${endUnitIndex}`,
      );

      return {
        ...event,
        dayIndex,
        gridRowStart: startUnitIndex,
        rowSpan: endUnitIndex - startUnitIndex + 1,
        startMinutes,
        endMinutes,
      };
    })
    .filter(Boolean);
});

const getEventsForPosition = (dayIndex, unitIndex) => {
  return processedEvents.value.filter(
    (event) => event.dayIndex === dayIndex && event.gridRowStart === unitIndex, // Only show event in its starting cell
  );
};

const formatEventTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const totalDuration = computed(() =>
  timetableData.value.reduce((sum, unit) => sum + unit.duration, 0),
);

const gridTemplateRows = computed(() =>
  timetableData.value.map((unit) => `${unit.duration / 20}fr`).join(" "),
);

const handleDayClick = (day, unit) => {
  emit("day-click", { day, unit });
};

const handleEventClick = (event) => {
  emit("event-click", event);
};

defineExpose({
  containerNav,
  timetableData,
  totalDuration,
  gridTemplateRows,
  weekDays,
  processedEvents,
  getEventsForPosition,
});
</script>
