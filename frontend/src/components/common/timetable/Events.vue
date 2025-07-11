<script setup>
import { computed } from "vue";

const props = defineProps({
  gridTemplateRows: {
    type: String,
    required: true,
  },
  timetableData: {
    type: Array,
    required: true,
  },
  events: {
    type: Array,
    default: () => [],
  },
});

// Default events if none provided
const defaultEvents = [
  {
    id: 1,
    title: "Mathematics",
    period: "Period 3",
    datetime: "2022-01-12T09:40",
    gridRow: "4 / span 1",
    column: "sm:col-start-3",
    bgColor: "bg-blue-50",
    hoverBgColor: "hover:bg-blue-100",
    titleColor: "text-blue-700",
    textColor: "text-blue-500",
    hoverTextColor: "group-hover:text-blue-700",
  },
  {
    id: 2,
    title: "Science",
    period: "Period 6",
    datetime: "2022-01-13T12:15",
    gridRow: "8 / span 1",
    column: "sm:col-start-4",
    bgColor: "bg-green-50",
    hoverBgColor: "hover:bg-green-100",
    titleColor: "text-green-700",
    textColor: "text-green-500",
    hoverTextColor: "group-hover:text-green-700",
  },
  {
    id: 3,
    title: "History",
    period: "Period 10",
    datetime: "2022-01-15T15:50",
    gridRow: "14 / span 1",
    column: "sm:col-start-6",
    bgColor: "bg-purple-50",
    hoverBgColor: "hover:bg-purple-100",
    titleColor: "text-purple-700",
    textColor: "text-purple-500",
    hoverTextColor: "group-hover:text-purple-700",
    additionalClasses: "hidden sm:flex",
  },
];

const eventsToRender = computed(() => {
  return props.events.length > 0 ? props.events : defaultEvents;
});

// Event click handler
const handleEventClick = (event) => {
  console.log("Event clicked:", event);
  // Emit event for parent to handle
  emit("event-click", event);
};

const emit = defineEmits(["event-click"]);
</script>

<template>
  <ol
    class="col-start-1 col-end-2 row-start-1 grid grid-cols-1 sm:grid-cols-7 sm:pr-8"
    :style="{ gridTemplateRows: gridTemplateRows }"
  >
    <li
      v-for="event in eventsToRender"
      :key="event.id"
      :class="['relative mt-px flex', event.column, event.additionalClasses]"
      :style="{ gridRow: event.gridRow }"
    >
      <a
        href="#"
        :class="[
          'group absolute inset-1 flex flex-col overflow-y-auto rounded-lg p-2 text-xs/5',
          event.bgColor,
          event.hoverBgColor,
        ]"
        @click.prevent="handleEventClick(event)"
      >
        <p :class="['order-1 font-semibold', event.titleColor]">
          {{ event.title }}
        </p>
        <p :class="[event.textColor, event.hoverTextColor]">
          <time :datetime="event.datetime">{{ event.period }}</time>
        </p>
      </a>
    </li>
  </ol>
</template>
