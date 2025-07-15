<script setup>
import CoursesOverview from "@/components/common/CoursesOverview.vue";
import GradesPreview from "@/components/student/GradesPreview.vue";
import TimetablePreview from "@/components/student/TimetablePreview.vue";
import { nextTick, onMounted } from "vue";

const props = defineProps({
  scrollContainer: Object,
});

onMounted(async () => {
  // Ensure scrollContainer is set if provided\
  await nextTick();
});
</script>

<template>
  <!-- 3 column wrapper -->
  <div class="mx-auto w-full grow lg:flex xl:px-2">
    <!-- Left sidebar & main wrapper -->
    <div class="flex-1 xl:flex">
      <div
        class="h-[calc(100vh-65px)] w-96 flex flex-col gap-5 border-gray-200 py-6 w-64 shrink-0 border-r pl-4 sticky top-0"
      >
        <div
          class="h-1/2 relative overflow-hidden rounded-lg bg-white shadow-md sm:pt-6 w-full"
        ></div>
        <GradesPreview class="h-1/2 w-full" />
      </div>

      <!-- CoursesOverview container - flows naturally with page scroll -->
      <div class="py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
        <CoursesOverview :scroll-container="scrollContainer" />
      </div>
    </div>

    <div
      class="h-[calc(100vh-65px)] flex flex-col border-gray-200 py-6 w-96 shrink-0 pr-4 sticky top-0"
    >
      <TimetablePreview class="h-full w-full" />
    </div>
  </div>
</template>
