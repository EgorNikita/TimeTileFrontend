<script setup>
import { ref, computed, watch } from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import { Calendar } from "lucide-vue-next";

// Helper Functions
const formatDate = (date) => date.toISOString().split("T")[0];
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const getLessonStatus = (lesson) => {
  const nowMinutes = toMinutes(currentTime.value.toTimeString().slice(0, 5));
  const start = toMinutes(lesson.startTime);
  const end = toMinutes(lesson.endTime);

  if (nowMinutes < start) return { status: "upcoming", progress: 0 };
  if (nowMinutes >= end) return { status: "completed", progress: 100 };

  const progress = ((nowMinutes - start) / (end - start)) * 100;
  return { status: "current", progress };
};

// State
const currentWeekStart = ref(new Date());
const selectedDate = ref(formatDate(new Date()));
const currentTime = ref(new Date());
const currentMonth = ref("");

const lessons = ref([
  {
    title: "Алгебра",
    startTime: "10:00",
    endTime: "10:45",
    teacher: "Іван Петренко",
    date: formatDate(new Date()),
  },
  {
    title: "Геометрія",
    startTime: "22:00",
    endTime: "23:45",
    teacher: "Олена Ковальчук",
    date: formatDate(new Date()),
  },
  {
    title: "Фізика",
    startTime: "23:00",
    endTime: "23:45",
    teacher: "Ірина Шевченко",
    date: formatDate(new Date()),
  },
]);

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
      name: date.toLocaleDateString("uk-UA", { weekday: "short" }),
      number: date.getDate(),
      isCurrentMonth: date.getMonth() === new Date().getMonth(),
      isSelected: selectedDate.value === dateStr,
      isToday,
      date: dateStr,
    });
  }

  return daysArray;
});

const filteredLessons = computed(() =>
  lessons.value.filter((lesson) => lesson.date === selectedDate.value),
);

// Methods
const updateMonthDisplay = () => {
  currentMonth.value = currentWeekStart.value.toLocaleDateString("uk-UA", {
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
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <div class="flex flex-col">
        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Calendar class="w-5 h-5" />
          Розклад
        </h2>
        <span class="text-xs text-gray-400 mt-1">{{ currentMonth }}</span>
      </div>
      <div class="flex items-center gap-1">
        <button
          type="button"
          class="p-1.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          @click="previousWeek"
        >
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <button
          type="button"
          class="p-1.5 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
          @click="nextWeek"
        >
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
      <div class="py-2">M</div>
      <div class="py-2">T</div>
      <div class="py-2">W</div>
      <div class="py-2">T</div>
      <div class="py-2">F</div>
      <div class="py-2">S</div>
      <div class="py-2">S</div>
    </div>

    <div class="grid grid-cols-7 gap-1 mb-6">
      <div
        v-for="(day, dayIdx) in days"
        :key="day.date"
        class="flex justify-center"
      >
        <button
          type="button"
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
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
    <div class="space-y-3">
      <div
        v-for="lesson in filteredLessons"
        :key="lesson.title + lesson.startTime"
        class="p-4 rounded-lg border shadow-sm"
        :class="{
          'bg-gray-100': getLessonStatus(lesson).status === 'completed',
          'bg-blue-50': getLessonStatus(lesson).status === 'current',
          'bg-white': getLessonStatus(lesson).status === 'upcoming',
        }"
      >
        <div class="flex items-center justify-between mb-1">
          <h3 class="text-lg font-semibold">{{ lesson.title }}</h3>
          <span class="text-sm text-gray-500">
            {{ lesson.startTime }} – {{ lesson.endTime }}
          </span>
        </div>
        <p class="text-sm text-gray-700 mb-2">Вчитель: {{ lesson.teacher }}</p>
        <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 transition-all"
            :style="{ width: getLessonStatus(lesson).progress + '%' }"
          ></div>
        </div>
      </div>

      <!-- No lessons -->
      <div
        v-if="filteredLessons.length === 0"
        class="text-center text-gray-400 mt-10"
      >
        У цей день занять немає
      </div>

      <!--      &lt;!&ndash; Time indicator &ndash;&gt;-->
      <!--        <div :class="getIndicatorStyle(lesson)">-->
      <!--          &lt;!&ndash; Progress bar for current lesson &ndash;&gt;-->
      <!--          <div-->
      <!--            v-if="getLessonStatus(lesson).status === 'current'"-->
      <!--            class="absolute bottom-0 left-0 w-full bg-blue-400 rounded-full transition-all duration-300"-->
      <!--            :style="{ height: `${getCurrentLessonProgress(lesson)}%` }"-->
      <!--          ></div>-->
      <!--        </div>-->

      <!--        &lt;!&ndash; Content &ndash;&gt;-->
      <!--        <div class="flex-1">-->
      <!--          <div class="flex items-center justify-between">-->
      <!--            <div class="flex items-center gap-4">-->
      <!--              <span class="text-sm font-medium text-gray-900">{{-->
      <!--                lesson.startTime-->
      <!--              }}</span>-->
      <!--              <span class="text-sm text-gray-900">{{ lesson.title }}</span>-->
      <!--            </div>-->
      <!--            <div class="flex items-center gap-2 text-sm text-gray-600">-->
      <!--              &lt;!&ndash;              <span>{{ lesson.room }}</span>&ndash;&gt;-->
      <!--              &lt;!&ndash;              <span class="font-medium">{{ lesson.number }}</span>&ndash;&gt;-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
    </div>
  </div>
</template>
