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
        :lessons="lessons"
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
import { EnrichedLesson } from "@/components/common/timetable/timetableInterfaces";

// Refs
const container = ref<HTMLElement | null>(null);
const timetableGridRef = ref<InstanceType<typeof TimetableGrid> | null>(null);

// Reactive data
const currentDate = ref<Date>(new Date());
const currentView = ref<ViewType>(VIEW_WEEK);
const views = ref<ViewType[]>([...VIEWS]);

// Sample events data
const lessons = ref<EnrichedLesson[]>([
  {
    id: 1,
    courseId: 1,
    subjectId: 1,
    teacherId: 1,
    roomId: 1,
    statusId: 1,
    timetableUnitIds: [1, 2],
    date: new Date("2025-07-11"),
    description: "Math class covering algebra and geometry.",
    courseTitle: "LKM_GYI231_FRA",
    subjectTitle: "Mathematics",
    teacherName: "John Doe",
    roomTitle: "Room 101",
    status: {
      id: 1,
      title: "Scheduled",
      color: "bg-blue-50",
    },

    // bgColor: "bg-blue-50",
    // hoverBgColor: "hover:bg-blue-100",
    // titleColor: "text-blue-700",
  },
  {
    id: 2,
    courseId: 2,
    subjectId: 2,
    teacherId: 2,
    roomId: 2,
    statusId: 1,
    timetableUnitIds: [4],
    date: new Date("2025-07-11"),
    description: "French conversation practice.",
    courseTitle: "FR_GYI101_FRA",
    subjectTitle: "French",
    teacherName: "Marie Curie",
    roomTitle: "Room 102",
    status: {
      id: 1,
      title: "Scheduled",
      color: "bg-blue-50",
    },
  },
  {
    id: 3,
    courseId: 3,
    subjectId: 3,
    teacherId: 3,
    roomId: 3,
    statusId: 2,
    timetableUnitIds: [4],
    date: new Date("2025-07-07"),
    description: "Physics introduction to motion.",
    courseTitle: "PHY_GYI301_ENG",
    subjectTitle: "Physics",
    teacherName: "Isaac Newton",
    roomTitle: "Lab A",
    status: {
      id: 2,
      title: "Completed",
      color: "bg-gray-100",
    },
  },
  {
    id: 4,
    courseId: 4,
    subjectId: 4,
    teacherId: 4,
    roomId: 4,
    statusId: 1,
    timetableUnitIds: [1],
    date: new Date("2025-07-08"),
    description: "Introduction to chemistry.",
    courseTitle: "CHE_GYI401_ENG",
    subjectTitle: "Chemistry",
    teacherName: "Marie Lavoisier",
    roomTitle: "Lab B",
    status: {
      id: 1,
      title: "Scheduled",
      color: "bg-blue-50",
    },
  },
  {
    id: 5,
    courseId: 5,
    subjectId: 5,
    teacherId: 5,
    roomId: 5,
    statusId: 3,
    timetableUnitIds: [2],
    date: new Date("2025-07-09"),
    description: "Biology: Cell structure.",
    courseTitle: "BIO_GYI501_ENG",
    subjectTitle: "Biology",
    teacherName: "Charles Darwin",
    roomTitle: "Room 202",
    status: {
      id: 3,
      title: "Cancelled",
      color: "bg-red-100",
    },
  },
  {
    id: 6,
    courseId: 6,
    subjectId: 6,
    teacherId: 6,
    roomId: 6,
    statusId: 1,
    timetableUnitIds: [1, 2],
    date: new Date("2025-07-10"),
    description: "History of the Middle Ages.",
    courseTitle: "HIS_GYI601_ENG",
    subjectTitle: "History",
    teacherName: "Ada Lovelace",
    roomTitle: "Room 103",
    status: {
      id: 1,
      title: "Scheduled",
      color: "bg-blue-50",
    },
  },
  {
    id: 7,
    courseId: 7,
    subjectId: 7,
    teacherId: 7,
    roomId: 7,
    statusId: 1,
    timetableUnitIds: [7],
    date: new Date("2025-07-12"),
    description: "Geography: Climates of the world.",
    courseTitle: "GEO_GYI701_ENG",
    subjectTitle: "Geography",
    teacherName: "Jane Goodall",
    roomTitle: "Room 104",
    status: {
      id: 1,
      title: "Scheduled",
      color: "bg-blue-50",
    },
  },
  {
    id: 8,
    courseId: 8,
    subjectId: 8,
    teacherId: 8,
    roomId: 8,
    statusId: 2,
    timetableUnitIds: [4],
    date: new Date("2025-07-13"),
    description: "Philosophy: Greek thinkers.",
    courseTitle: "PHI_GYI801_ENG",
    subjectTitle: "Philosophy",
    teacherName: "Socrates",
    roomTitle: "Room 105",
    status: {
      id: 2,
      title: "Completed",
      color: "bg-gray-100",
    },
  },
  {
    id: 9,
    courseId: 9,
    subjectId: 9,
    teacherId: 9,
    roomId: 9,
    statusId: 1,
    timetableUnitIds: [1],
    date: new Date("2025-07-08"),
    description: "Computer Science: Intro to programming.",
    courseTitle: "CS_GYI901_ENG",
    subjectTitle: "Computer Science",
    teacherName: "Alan Turing",
    roomTitle: "Room 106",
    status: {
      id: 1,
      title: "Scheduled",
      color: "bg-blue-50",
    },
  },
  {
    id: 10,
    courseId: 10,
    subjectId: 10,
    teacherId: 10,
    roomId: 10,
    statusId: 1,
    timetableUnitIds: [1],
    date: new Date("2025-07-07"),
    description: "Art: Renaissance painting.",
    courseTitle: "ART_GYI1001_ENG",
    subjectTitle: "Art",
    teacherName: "Leonardo da Vinci",
    roomTitle: "Studio 1",
    status: {
      id: 1,
      title: "Scheduled",
      color: "bg-blue-50",
    },
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
