<script setup>
import CoursesOverview from "@/components/common/CoursesOverview.vue";
import GradesPreview from "@/components/student/GradesPreview.vue";
import TimetablePreview from "@/components/student/TimetablePreview.vue";
</script>

<template>
  <!-- 3 column wrapper -->
  <div class="mx-auto w-full h-full grow lg:flex xl:px-2">
    <!-- Left sidebar & main wrapper -->
    <div class="flex-1 xl:flex">
      <div
        class="flex min-w-fit flex-col border-b border-gray-200 py-4 sm:px-6 lg:pl-4 xl:w-64 xl:shrink-0 xl:border-r xl:border-b-0 xl:pl-4 h-full"
      >
        <div
          class="h-1/2 relative overflow-hidden rounded-lg bg-white pt-5 pb-12 shadow-sm sm:pt-6"
        ></div>
        <GradesPreview class="h-1/2" />
      </div>

      <div class="py-4 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
        <CoursesOverview class="h-full" />
      </div>
    </div>

    <div
      class="shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6 lg:w-96 lg:border-t-0 lg:border-l lg:pr-8 xl:pr-6"
    >
      <TimetablePreview class="h-full" />
    </div>
  </div>
</template>
