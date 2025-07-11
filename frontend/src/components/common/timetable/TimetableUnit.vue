<template>
  <!-- This component represents the 7 day columns only (col-span-7) -->
  <div class="grid grid-cols-7 divide-x divide-gray-100 bg-white relative">
    <div
      v-for="(day, dayIndex) in weekDays"
      :key="dayIndex"
      class="relative min-h-12 p-1"
      :class="[
        unit.isBreak ? 'bg-gray-50 text-gray-400' : 'hover:bg-gray-50',
        day.isToday && !unit.isBreak ? 'bg-blue-50' : '',
      ]"
    >
      <!-- Unit tittitle shown only on the first column -->
      <div
        v-if="dayIndex === 0 && !unit.isBreak"
        class="absolute left-1 top-1 text-xs font-medium text-gray-700 bg-white px-1 py-0.5 rounded shadow-sm z-10"
      >
        {{ unit.title }}
      </div>

      <!-- Events inside this cell -->
      <div
        v-for="event in getEventsForDay(day, dayIndex)"
        :key="event.id"
        class="absolute inset-1 bg-indigo-100 border border-indigo-200 rounded p-1 cursor-pointer hover:bg-indigo-200 transition-colors z-20"
        @click="$emit('event-click', event)"
      >
        <div class="text-xs font-medium text-indigo-900 truncate">
          {{ event.title }}
        </div>
        <div class="text-xs text-indigo-700 truncate">
          {{ formatEventTime(event.datetime) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  unit: { type: Object, required: true },
  events: { type: Array, default: () => [] },
  unitIndex: { type: Number, required: true },
  weekDays: { type: Array, required: true },
});

defineEmits(["event-click"]);

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const getEventsForDay = (day, dayIndex) => {
  return props.events.filter((event) => {
    const eventDate = new Date(event.datetime);
    const eventDay = eventDate.getDay();
    const adjustedEventDay = eventDay === 0 ? 6 : eventDay - 1;
    return adjustedEventDay === dayIndex;
  });
};

const formatEventTime = (datetime) => {
  const date = new Date(datetime);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const unitData = computed(() => ({
  ...props.unit,
  duration:
    timeToMinutes(props.unit.endTime) - timeToMinutes(props.unit.startTime),
  startMinutes: timeToMinutes(props.unit.startTime),
  endMinutes: timeToMinutes(props.unit.endTime),
  isBreak: props.unit.title === "Break",
}));

defineExpose({ unitData, getEventsForDay });
</script>
