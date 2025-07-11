<!-- Main Timetable Component -->
<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div class="sticky top-0 z-30">
      <TimetableHeader
        :current-date="currentDate"
        :display-date="displayDate"
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
    <div class="flex-1 bg-white shadow-md m-5 mt-0 rounded-lg overflow-hidden">
      <TimetableGrid
        ref="timetableGridRef"
        :timetable-units="timetableUnits"
        :events="events"
        @day-click="handleDayClick"
        @event-click="handleEventClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import TimetableHeader from "@/components/common/timetable/TimetableHeader.vue";
import TimetableGrid from "@/components/common/timetable/TimetableGrid.vue";

// Refs
const container = ref(null);
const timetableGridRef = ref(null);

// Reactive data
const currentDate = ref("2022-01");
const displayDate = ref("January 2022");
const currentView = ref("Week view");
const views = ref(["Day view", "Week view", "Month view", "Year view"]);

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

const timetableUnits = ref([
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
    id: 3,
    title: "Break",
    startTime: "09:20",
    endTime: "09:40",
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
    id: 6,
    title: "Break",
    startTime: "11:10",
    endTime: "11:30",
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
    id: 9,
    title: "Break",
    startTime: "13:00",
    endTime: "13:15",
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
    id: 12,
    title: "Break",
    startTime: "14:45",
    endTime: "15:05",
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
    id: 15,
    title: "Break",
    startTime: "16:35",
    endTime: "16:50",
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
    id: 18,
    title: "Break",
    startTime: "18:20",
    endTime: "18:30",
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
    id: 21,
    title: "Break",
    startTime: "20:00",
    endTime: "20:15",
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

// Helper function to convert time string to minutes
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// Event handlers
const handlePrevious = () => {
  console.log("Previous week clicked");
  // Add your navigation logic here
};

const handleNext = () => {
  console.log("Next week clicked");
  // Add your navigation logic here
};

const handleToday = () => {
  console.log("Today clicked");
  // Add your today navigation logic here
};

const handleViewChange = (view) => {
  console.log("View changed to:", view);
  currentView.value = view;
  // Add your view change logic here
};

const handleAddEvent = () => {
  console.log("Add event clicked");
  // Add your event creation logic here
};

const handleDayClick = (day) => {
  console.log("Day clicked:", day);
  // Add your day click logic here
};

const handleEventClick = (event) => {
  console.log("Event clicked in parent:", event);
  // Add your event handling logic here
};

onMounted(() => {
  // Set the container scroll position based on the current time
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Find current position in timetable
  const startTime = timeToMinutes(timetableUnits.value[0].startTime);
  const endTime = timeToMinutes(
    timetableUnits.value[timetableUnits.value.length - 1].endTime,
  );

  if (currentMinutes >= startTime && currentMinutes <= endTime) {
    const progress = (currentMinutes - startTime) / (endTime - startTime);
    container.value.scrollTop =
      progress * (container.value.scrollHeight - container.value.clientHeight);
  }
});
</script>
