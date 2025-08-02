<script setup lang="ts">
import CoursesOverview from "@/components/common/CoursesOverview.vue";
import GradesPreview from "@/components/student/GradesPreview.vue";
import TimetablePreview from "@/components/student/TimetablePreview.vue";
import { nextTick, onMounted } from "vue";
import AssignmentsPreview from "@/components/student/AssignmentsPreview.vue";

const props = defineProps({
  scrollContainer: Object,
});

onMounted(async () => {
  await nextTick();
});
</script>

<template>
  <!-- Mobile-first responsive wrapper -->
  <div class="mx-auto w-full grow">
    <!-- Mobile Layout (< lg) - Stack everything vertically -->
    <div class="lg:hidden">
      <!-- Mobile header cards - side by side -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        <div class="h-80 sm:h-96">
          <AssignmentsPreview class="h-full w-full" />
        </div>
        <div class="h-80 sm:h-96">
          <GradesPreview class="h-full w-full" />
        </div>
      </div>

      <!-- Mobile timetable - full width -->
      <div class="px-4 pb-4">
        <div class="h-80 sm:h-96">
          <TimetablePreview class="h-full w-full" />
        </div>
      </div>

      <!-- Mobile courses overview - flows naturally -->
      <div class="px-4 pb-6">
        <CoursesOverview :scroll-container="scrollContainer" />
      </div>
    </div>

    <!-- Desktop Layout (>= lg) - Original 3-column layout -->
    <div class="hidden lg:flex xl:px-2">
      <!-- Left sidebar & main wrapper -->
      <div class="flex-1 xl:flex">
        <!-- Left sidebar - assignments and grades -->
        <div
          class="w-64 xl:w-80 flex flex-col gap-5 py-6 shrink-0 pl-4 sticky top-0 h-[calc(100vh-65px)]"
        >
          <AssignmentsPreview class="h-1/2 w-full" />
          <GradesPreview class="h-1/2 w-full" />
        </div>

        <!-- CoursesOverview container - flows naturally with page scroll -->
        <div class="py-6 px-6 xl:flex-1 xl:pl-6">
          <CoursesOverview :scroll-container="scrollContainer" />
        </div>
      </div>

      <!-- Right sidebar - timetable -->
      <div
        class="w-80 xl:w-96 flex flex-col py-6 shrink-0 pr-4 sticky top-0 h-[calc(100vh-65px)]"
      >
        <TimetablePreview class="h-full w-full" />
      </div>
    </div>
  </div>
</template>
