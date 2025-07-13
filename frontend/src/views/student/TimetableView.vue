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
        :lessons="events"
        @day-click="handleDayClick"
        @event-click="handleEventClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import TimetableHeader from "@/components/common/timetable/TimetableHeader.vue";
import TimetableGrid from "@/components/common/timetable/TimetableGrid.vue";
import { Lesson, TimetableUnit } from "@/types/lesson";
import { timeToMinutes } from "@/components/common/timetable/timetableUtils";
import {
  VIEW_WEEK,
  VIEWS,
  ViewType,
} from "@/components/common/timetable/timetableConstants";

// Refs
const container = ref<HTMLElement | null>(null);
const timetableGridRef = ref<InstanceType<typeof TimetableGrid> | null>(null);

// Reactive data
const currentDate = ref<Date>(new Date());
const currentView = ref<ViewType>(VIEW_WEEK);
const views = ref<ViewType[]>([...VIEWS]);

// Sample events data
const events = ref([
  {
    id: 1,
    title: "Mathematics",
    period: "Period 3",
    startTime: "2025-07-11T10:00",
    endTime: "2025-07-11T11:30",
    bgColor: "bg-blue-50",
    hoverBgColor: "hover:bg-blue-100",
    titleColor: "text-blue-700",
  },
  {
    id: 2,
    title: "Science",
    period: "Period 6",
    startTime: "2022-07-11T12:15",
    endTime: "2022-07-11T13:00",
    bgColor: "bg-green-50",
    hoverBgColor: "hover:bg-green-100",
    titleColor: "text-green-700",
  },
  {
    id: 3,
    title: "History",
    period: "Period 10",
    startTime: "2025-07-11T15:50",
    endTime: "2025-07-11T16:35",
    bgColor: "bg-purple-50",
    hoverBgColor: "hover:bg-purple-100",
    titleColor: "text-purple-700",
  },
]);

const timetableUnits = ref<TimetableUnit[]>([
  {
    id: 1,
    title: "1.",
    startTime: "07:50",
    endTime: "08:35",
  },
  {
    id: 2,
    title: "2.",
    startTime: "08:35",
    endTime: "09:20",
  },
  {
    id: 4,
    title: "3.",
    startTime: "09:40",
    endTime: "10:25",
  },
  {
    id: 5,
    title: "4.",
    startTime: "10:25",
    endTime: "11:10",
  },
  {
    id: 7,
    title: "5.",
    startTime: "11:30",
    endTime: "12:15",
  },
  {
    id: 8,
    title: "6.",
    startTime: "12:15",
    endTime: "13:00",
  },
  {
    id: 10,
    title: "7.",
    startTime: "13:15",
    endTime: "14:00",
  },
  {
    id: 11,
    title: "8.",
    startTime: "14:00",
    endTime: "14:45",
  },
  {
    id: 13,
    title: "9.",
    startTime: "15:05",
    endTime: "15:50",
  },
  {
    id: 14,
    title: "10.",
    startTime: "15:50",
    endTime: "16:35",
  },
  {
    id: 16,
    title: "11.",
    startTime: "16:50",
    endTime: "17:35",
  },
  {
    id: 17,
    title: "12.",
    startTime: "17:35",
    endTime: "18:20",
  },

  {
    id: 19,
    title: "13.",
    startTime: "18:30",
    endTime: "19:15",
  },
  {
    id: 20,
    title: "14.",
    startTime: "19:15",
    endTime: "20:00",
  },

  {
    id: 22,
    title: "15.",
    startTime: "20:15",
    endTime: "21:00",
  },
  {
    id: 23,
    title: "16.",
    startTime: "21:00",
    endTime: "21:45",
  },
]);

// Scroll to current time
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
const handlePrevious = (): void => {
  const change = currentView.value === "Week view" ? -7 : -1;
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + change);
  currentDate.value = newDate;
};

const handleNext = (): void => {
  const change = currentView.value === "Week view" ? 7 : 1;
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + change);
  currentDate.value = newDate;
};

const handleToday = (): void => {
  currentDate.value = new Date();
};

const handleViewChange = (view: ViewType): void => {
  if (VIEWS.includes(view)) {
    currentView.value = view;
  }
};

const handleAddEvent = (): void => {
  console.log("Add event clicked");
};

const handleDayClick = (payload: { date: Date }): void => {
  console.log("Day clicked:", payload.date);
  currentDate.value = payload.date;
};

const handleEventClick = (event: Event): void => {
  console.log("Event clicked:", event);
};
</script>
