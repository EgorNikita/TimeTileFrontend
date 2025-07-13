<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";
import {
  Day,
  ProcessedLesson,
  TimetableData,
} from "@/components/common/timetable/timetableInterfaces";
import { formatTime, getDateNumber, getYearAsText } from "./timetableUtils";
import { computed } from "vue";

// Props
interface Props {
  currentDate: Date;
  timetableUnits: TimetableData[];
  lessons?: ProcessedLesson[];
  gridTemplateRows: string;
}

const props = withDefaults(defineProps<Props>(), {
  lessons: () => [],
});

// Emits
interface Emits {
  "day-click": [payload: { date: Date }];
  "event-click": [event: ProcessedLesson];
}
const emit = defineEmits<Emits>();

// Computed properties
const today = computed(() => new Date());
const selectedDate = computed(() => props.currentDate);

const startDate = computed(() => {
  const startOfMonth = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth(),
    1,
  );
  const start = new Date(startOfMonth);
  const dayOfWeek = start.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = (dayOfWeek + 6) % 7; // convert to Monday=0, Sunday=6
  start.setDate(start.getDate() - diff);
  return start;
});

const endDate = computed(() => {
  const start = startDate.value;
  const end = new Date(start);
  end.setDate(start.getDate() + 41);
  return end;
});

const days = computed<Day[]>(() => {
  const result: Day[] = [];
  const current = new Date(startDate.value);
  console.log(props.currentDate.toDateString());
  while (current <= endDate.value) {
    result.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === props.currentDate.getMonth(),
      isToday: current.toDateString() === today.value.toDateString(),
      isSelected: current.toDateString() === selectedDate.value.toDateString(),
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
});

// Event handlers
const handleDayClick = (day: Day): void => {
  if (!day.isCurrentMonth || !day.date) return;
  const date = new Date(day.date);
  emit("day-click", { date });
};

const handleMonthOffset = (offset: number): void => {
  const newDate = new Date(props.currentDate);
  newDate.setMonth(newDate.getMonth() + offset);
  newDate.setDate(1);
  emit("day-click", { date: newDate });
};
</script>

<template>
  <div class="flex flex-row h-full">
    <div class="flex-1 overflow-auto">
      <div
        class="grid grid-cols-[50px_repeat(1,1fr)] sm:grid-cols-[100px_repeat(1,1fr)] divide-x divide-y divide-gray-200 min-h-full"
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

          <div
            class="relative min-h-[60px] transition-colors duration-150"
            :class="[
              unit.isBreak
                ? 'bg-gray-100'
                : 'bg-white hover:bg-gray-50 cursor-pointer',
            ]"
            :style="{ gridRow: rowIndex + 1 }"
          >
            <!-- Optional break indicator -->
            <div
              v-if="unit.isBreak"
              class="absolute inset-0 flex items-center justify-center"
            ></div>
          </div>
        </template>
      </div>
    </div>

    <div class="flex-1 relative w-1/2 max-w-md hidden md:block">
      <div class="sticky top-[80px] z-30 px-8 py-10">
        <div class="flex items-center text-center text-gray-900">
          <button
            type="button"
            class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 cursor-pointer"
            @click.stop="handleMonthOffset(-1)"
            v-tooltip.left="{
              content: 'Previous month',
              theme: 'simple-tooltip',
              boundary: 'scrollParent',
              strategy: 'fixed',
              flip: true,
              preventOverflow: true,
            }"
          >
            <span class="sr-only">Previous month</span>
            <ChevronLeftIcon class="size-5" aria-hidden="true" />
          </button>
          <div class="flex-auto text-md font-semibold">
            {{ getYearAsText(currentDate) }}
          </div>
          <button
            type="button"
            class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500 cursor-pointer"
            @click.stop="handleMonthOffset(1)"
            v-tooltip.right="{
              content: 'Next month',
              theme: 'simple-tooltip',
              boundary: 'scrollParent',
              strategy: 'fixed',
              flip: true,
              preventOverflow: true,
            }"
          >
            <span class="sr-only">Next month</span>
            <ChevronRightIcon class="size-5" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 grid grid-cols-7 text-center text-xs/6 text-gray-500">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>Th</div>
          <div>F</div>
          <div>Sa</div>
          <div>Su</div>
        </div>
        <div
          class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow-sm ring-1 ring-gray-200"
        >
          <button
            v-for="(day, dayIdx) in days"
            :key="day.date.toDateString()"
            type="button"
            @click.stop="handleDayClick(day)"
            :class="[
              'py-1.5 focus:z-10',
              day.isCurrentMonth
                ? 'bg-white hover:bg-gray-100 cursor-pointer'
                : 'bg-gray-50',
              (day.isSelected || day.isToday) && 'font-semibold',
              day.isSelected && 'text-white',
              !day.isSelected &&
                day.isCurrentMonth &&
                !day.isToday &&
                'text-gray-900',
              !day.isSelected &&
                !day.isCurrentMonth &&
                !day.isToday &&
                'text-gray-400',
              day.isToday && !day.isSelected && 'text-blue-500',
              dayIdx === 0 && 'rounded-tl-lg',
              dayIdx === 6 && 'rounded-tr-lg',
              dayIdx === days.length - 7 && 'rounded-bl-lg',
              dayIdx === days.length - 1 && 'rounded-br-lg',
            ]"
          >
            <time
              :datetime="day.date.toDateString()"
              :class="[
                'mx-auto flex size-7 items-center justify-center rounded-full',
                {
                  'bg-blue-500': day.isSelected && day.isToday,
                  'bg-gray-900': day.isSelected && !day.isToday,
                },
              ]"
              >{{ getDateNumber(day.date) }}</time
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
