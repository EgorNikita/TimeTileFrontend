<script setup lang="ts">
import { formatTime } from "./timetableUtils";
import { WeekDay, TimetableData, ProcessedLesson } from "./timetableInterfaces";
import { MapPinIcon, UserIcon } from "@heroicons/vue/20/solid";

// Props
interface Props {
  weekDays: WeekDay[];
  timetableUnits: TimetableData[];
  lessons?: ProcessedLesson[];
  gridTemplateRows: string;
}
const props = withDefaults(defineProps<Props>(), {
  lessons: () => [],
});

// Emits
interface Emits {
  "day-click": [payload: { day: WeekDay; unit: TimetableData }];
  "event-click": [event: ProcessedLesson];
  "header-click": [day: WeekDay];
  "cell-click": [payload: { day: WeekDay; unit: TimetableData }];
}
const emit = defineEmits<Emits>();

// Handlers
const handleCellClick = (day: WeekDay, unit: TimetableData): void => {
  emit("cell-click", { day, unit });
};

const handleEventClick = (event: ProcessedLesson, nativeEvent: Event): void => {
  nativeEvent.stopPropagation();
  emit("event-click", event);
};

const handleHeaderClick = (day: WeekDay): void => {
  emit("header-click", day);
};
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Header Row -->
    <div
      class="sticky top-[64px] z-30 grid lg:grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[50px_repeat(7,1fr)] divide-x divide-gray-200 rounded-t-lg shadow-sm"
    >
      <!-- Empty top-left cell -->
      <div class="bg-white rounded-tl-lg border-r border-gray-200" />

      <!-- Weekday Headers -->
      <div
        v-for="(day, index) in props.weekDays"
        :key="`header-${day.date}`"
        class="flex items-center justify-center py-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        :class="index === props.weekDays.length - 1 ? 'rounded-tr-lg' : ''"
        @click="handleHeaderClick(day)"
      >
        <span class="flex items-baseline">
          <span class="text-sm font-medium text-gray-700">{{ day.full }}</span>
          <span
            class="ml-2 w-7 h-7 flex items-center justify-center rounded-full font-semibold text-sm transition-colors"
            :class="
              day.isToday
                ? 'text-white bg-indigo-600'
                : 'text-gray-900 hover:bg-gray-100'
            "
          >
            {{ day.date }}
          </span>
        </span>
      </div>
    </div>

    <!-- Timetable Body -->
    <div class="relative flex-1 overflow-auto">
      <div
        class="grid lg:grid-cols-[100px_repeat(7,1fr)] sm:grid-cols-[50px_repeat(7,1fr)] divide-x divide-y divide-gray-200 min-h-full"
        :style="{
          gridTemplateRows: gridTemplateRows,
          gridAutoFlow: 'row dense',
        }"
      >
        <!-- Time Rows and Grid Cells -->
        <template
          v-for="(unit, rowIndex) in props.timetableUnits"
          :key="`unit-${unit.id}`"
        >
          <!-- Time Label Column -->
          <div
            class="sticky left-0 z-10 flex flex-col h-full items-center justify-center px-2 py-2 text-xs border-r border-gray-200"
            :class="
              unit.isBreak
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white text-gray-600'
            "
            :style="{ gridColumn: 1, gridRow: rowIndex + 1 }"
          >
            <div
              class="flex-1 self-start flex items-center justify-center text-gray-400 mt-1 text-center leading-tight"
            >
              {{ formatTime(unit.startTime) }}
            </div>
            <div
              class="flex-1 flex flex-col items-center justify-center font-semibold text-center leading-tight"
            >
              <div class="mt-0.5 text-xs">{{ unit.title }}</div>
              <div v-if="unit.isBreak" class="mt-0.5 text-xs text-gray-300">
                {{ Math.round(unit.duration) }}min
              </div>
            </div>
            <div
              class="flex-1 self-end flex items-center justify-center text-gray-400 mt-1 text-center leading-tight"
            >
              {{ formatTime(unit.endTime) }}
            </div>
          </div>

          <!-- Grid Cells for Each Day -->
          <div
            v-for="(day, colIndex) in props.weekDays"
            :key="`cell-${unit.id}-${day.date}`"
            class="relative min-h-[60px] transition-colors duration-150"
            :class="[
              unit.isBreak
                ? 'bg-gray-10'
                : day.isToday
                  ? 'bg-indigo-50 hover:bg-blue-100 cursor-pointer'
                  : 'bg-white hover:bg-gray-50 cursor-pointer',
            ]"
            :style="{ gridColumn: colIndex + 2, gridRow: rowIndex + 1 }"
            @click="!unit.isBreak && handleCellClick(day, unit)"
          >
            <!-- Optional break indicator -->
            <div
              v-if="unit.isBreak"
              class="absolute inset-0 flex items-center justify-center"
            ></div>
          </div>
        </template>

        <!-- Lessons (Events) -->
        <!--        <template v-for="lesson in props.lessons" :key="`lesson-${lesson.id}`">-->
        <!--          <div-->
        <!--            class="t z-20 m-1 p-3 rounded-lg text-sm font-medium shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 hover:opacity-90"-->
        <!--            :class="[-->
        <!--              lesson.status.color || 'bg-blue-50',-->
        <!--              lesson.titleColor || 'text-white',-->
        <!--            ]"-->
        <!--            :style="{-->
        <!--              gridColumn: lesson.dayIndex + 2,-->
        <!--              gridRow: `${lesson.gridRowStart + 1} / span ${lesson.rowSpan}`,-->
        <!--            }"-->
        <!--            @click="handleEventClick(lesson, $event)"-->
        <!--          >-->
        <!--            <div class="font-semibold text-blue-700 truncate text-sm">-->
        <!--              {{ lesson.courseTitle }}-->
        <!--            </div>-->
        <!--            <div class="text-blue-700 truncate text-xs">-->
        <!--              {{ lesson.subjectTitle }}-->
        <!--            </div>-->
        <!--            <div class="text-xs text-blue-700 opacity-80 mt-1 truncate">-->
        <!--              {{ lesson.roomTitle }}-->
        <!--            </div>-->
        <!--            <div class="text-xs text-blue-700 opacity-70 mt-1">-->
        <!--              {{ lesson.teacherName }}-->
        <!--            </div>-->
        <!--            <div-->
        <!--              v-if="lesson.description"-->
        <!--              class="text-xs text-blue-700 opacity-70 mt-1"-->
        <!--            >-->
        <!--              {{ lesson.description }}-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </template>-->

        <template v-for="lesson in props.lessons" :key="`lesson-${lesson.id}`">
          <div
            class="relative z-20 m-1 p-4 rounded-md text-sm font-medium shadow-sm overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 group border border-white/20 backdrop-blur-sm"
            :class="[lesson.status.color || 'bg-blue-50']"
            :style="{
              gridColumn: lesson.dayIndex + 2,
              gridRow: `${lesson.gridRowStart} / span ${lesson.rowSpan}`,
            }"
            @click="handleEventClick(lesson, $event)"
          >
            <!-- Content container -->
            <div class="relative z-10 space-y-2">
              <!-- Course title -->
              <div
                class="font-bold text-gray-700 text-base leading-tight truncate drop-shadow-sm"
              >
                {{ lesson.courseTitle }}
              </div>

              <!-- Subject title -->
              <div class="text-gray-700/90 font-medium text-sm truncate">
                {{ lesson.subjectTitle }}
              </div>

              <!-- Room info -->
              <div class="flex items-center space-x-1 text-xs text-gray-700/80">
                <MapPinIcon
                  class="w-4 h-4 flex-shrink-0 text-gray-700"
                  aria-hidden="true"
                />
                <span class="truncate">{{ lesson.roomTitle }}</span>
              </div>

              <!-- Teacher name -->
              <div class="flex items-center space-x-1 text-xs text-gray-700/80">
                <UserIcon
                  class="w-4 h-4 flex-shrink-0 text-gray-700"
                  aria-hidden="true"
                />
                <span class="truncate">{{ lesson.teacherName }}</span>
              </div>

              <!--              &lt;!&ndash; Description &ndash;&gt;-->
              <!--              <div-->
              <!--                v-if="lesson.description"-->
              <!--                class="text-xs text-gray-700/70 leading-relaxed line-clamp-2 mt-3 pt-2 border-t border-gray-400/20"-->
              <!--              >-->
              <!--                {{ lesson.description }}-->
              <!--              </div>-->
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
