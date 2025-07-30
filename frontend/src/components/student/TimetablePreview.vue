<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import { Calendar } from "lucide-vue-next";
import { useTimetableUnits } from "@/tanStackQueries/student/timetableUnit/useTimetableUnits.js";
import { useStudentLessonInfoPeriodConstraint } from "@/tanStackQueries/student/student/useStudentLessonInfoPeriodConstraint.js";
import { formatTime } from "@/components/common/timetable/timetableUtils.js";
import { useAuth } from "@/composables/useAuth.js";

// Helper Functions
const formatDate = (date) => date.toISOString().split("T")[0];
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getCombinedDateTime = () => {
  const date = new Date(selectedDate.value);
  const time = currentTime.value;

  const combined = new Date(date); // Clone to avoid mutation
  combined.setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds(),
  );
  return combined;
};

const getStartTime = (lessonInfo) => {
  const firstUnitId = Math.min(
    ...lessonInfo.lesson.timetableUnitIds.map((id) => Number(id)),
  );
  const firstUnit = timetableUnits.value.find(
    (unit) => unit.id === firstUnitId,
  );
  return formatTime(firstUnit.startTime);
};

const getEndTime = (lessonInfo) => {
  const lastUnitId = Math.max(
    ...lessonInfo.lesson.timetableUnitIds.map((id) => Number(id)),
  );
  const lastUnit = timetableUnits.value.find((unit) => unit.id === lastUnitId);
  return formatTime(lastUnit.endTime);
};

const getLessonStatus = (lessonInfo) => {
  if (selectedDate.value < formatDate(new Date()))
    // For past dates
    return { status: "completed", progress: 100 };
  else if (selectedDate.value > formatDate(new Date()))
    // For future dates
    return { status: "upcoming", progress: 0 };

  const now = getCombinedDateTime();

  const start = getStartTime(lessonInfo);
  const end = getEndTime(lessonInfo);

  if (now < start) return { status: "upcoming", progress: 0 };
  if (now >= end) return { status: "completed", progress: 100 };

  const progress = ((now - start) / (end - start)) * 100;
  return { status: "current", progress };
};

// State
const today = new Date();
const day = today.getDay();
const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
const weekStart = new Date(today.setDate(diff));

const currentWeekStart = ref(weekStart);
const selectedDate = ref(formatDate(new Date()));
const currentTime = ref(new Date());
const currentMonth = ref("");

// Timetable Units
const timetableUnitsQuery = useTimetableUnits({ fetchAll: true });
const timetableUnits = computed(() => {
  return timetableUnitsQuery.data?.value ?? [];
});

const fetchLessonsFilters = computed(() => {
  const fromDate = new Date(selectedDate.value);
  fromDate.setHours(0, 0, 0, 0);

  const untilDate = new Date(selectedDate.value);
  untilDate.setDate(untilDate.getDate() + 1);
  untilDate.setHours(0, 0, 0, 0);

  return {
    from: fromDate.toISOString(),
    until: untilDate.toISOString(),
    fetchAll: true,
  };
});

const { user } = useAuth();
const lessonsQuery = useStudentLessonInfoPeriodConstraint(
  user.currentUser.value.id,
  fetchLessonsFilters,
);

const lessonInfos = computed(
  () => lessonsQuery.data.value?.pages?.flatMap((page) => page.items) ?? [],
);

const sortedLessonInfosWithStatus = computed(() => {
  return lessonInfos.value
    .map((lessonInfo) => ({
      ...lessonInfo,
      status: getLessonStatus(lessonInfo),
      startTime: getStartTime(lessonInfo),
      endTime: getEndTime(lessonInfo),
    }))
    .toSorted((a, b) => {
      return toMinutes(a.startTime) - toMinutes(b.startTime);
    });
});

// Computed
const days = computed(() => {
  const start = new Date(currentWeekStart.value);
  const daysArray = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = formatDate(date);
    const isToday = dateStr === formatDate(new Date());

    daysArray.push({
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      number: date.getDate(),
      isCurrentMonth: date.getMonth() === new Date().getMonth(),
      isSelected: selectedDate.value === dateStr,
      isToday,
      date: dateStr,
    });
  }

  return daysArray;
});

// Methods
const updateMonthDisplay = () => {
  currentMonth.value = currentWeekStart.value.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const previousWeek = () => {
  currentWeekStart.value.setDate(currentWeekStart.value.getDate() - 7);
  currentWeekStart.value = new Date(currentWeekStart.value); // trigger reactivity
};

const nextWeek = () => {
  currentWeekStart.value.setDate(currentWeekStart.value.getDate() + 7);
  currentWeekStart.value = new Date(currentWeekStart.value); // trigger reactivity
};

const selectDate = (date) => {
  selectedDate.value = date;
};

const goToToday = () => {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  currentWeekStart.value = monday;
  selectedDate.value = formatDate(today);
};

// Watchers
watch(currentWeekStart, updateMonthDisplay, { immediate: true });

setInterval(() => {
  currentTime.value = new Date();
}, 60 * 1000);
</script>

<template>
  <div
    class="flex flex-col flex-1 max-w-md h-full mx-auto bg-white rounded-lg shadow-md p-6"
  >
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex flex-col">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar class="w-5 h-5" />
          Timetable
        </h2>
        <span class="text-xs text-gray-400 mt-1">{{ currentMonth }}</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="cursor-pointer p-1.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          @click="previousWeek"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <button
          type="button"
          class="cursor-pointer p-1.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          @click="nextWeek"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
      <div class="py-2">M</div>
      <div class="py-2">Tu</div>
      <div class="py-2">W</div>
      <div class="py-2">Th</div>
      <div class="py-2">F</div>
      <div class="py-2">Sa</div>
      <div class="py-2">Su</div>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-6">
      <div v-for="day in days" :key="day.date" class="flex justify-center">
        <button
          type="button"
          :class="[
            'cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
            day.isSelected
              ? 'bg-black text-white'
              : day.isToday
                ? 'border border-black text-black'
                : day.isCurrentMonth
                  ? 'text-gray-900 hover:bg-gray-100'
                  : 'text-gray-400',
          ]"
          @click="selectDate(day.date)"
        >
          {{ day.number }}
        </button>
      </div>
    </div>

    <!-- Lessons List -->
    <div
      class="flex flex-col flex-1 space-y-3 h-full overflow-y-auto custom-scrollbar pr-3"
    >
      <div
        v-for="lessonInfo in sortedLessonInfosWithStatus"
        :key="lessonInfo.lesson.course.title + lessonInfo.startTime"
        class="p-4 rounded-lg border shadow-sm"
        :class="{
          'bg-gray-100': getLessonStatus(lessonInfo).status === 'completed',
          'bg-blue-50': getLessonStatus(lessonInfo).status === 'current',
          'bg-white': getLessonStatus(lessonInfo).status === 'upcoming',
        }"
      >
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-lg font-semibold">
            {{ lessonInfo.lesson.course.title }}
          </h3>
          <span class="text-sm text-gray-500 whitespace-nowrap">
            {{ lessonInfo.startTime }} – {{ lessonInfo.endTime }}
          </span>
        </div>
        <p class="text-sm text-gray-700 mb-2">
          Teacher:
          {{
            lessonInfo.lesson.teacher.firstname +
            " " +
            lessonInfo.lesson.teacher.lastname
          }}
        </p>
        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 transition-all"
            :style="{ width: lessonInfo.status.progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- No lessons -->
      <div
        v-if="lessonInfos.length === 0"
        class="text-center text-gray-400 mt-10"
      >
        No lessons for this day.
      </div>
    </div>
  </div>
</template>
