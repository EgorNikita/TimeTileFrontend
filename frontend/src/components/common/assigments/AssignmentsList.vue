<template>
  <div class="space-y-6">
    <div
      v-for="dateGroup in groupedAssignments"
      :key="dateGroup.date"
      class="space-y-4"
    >
      <!-- Date Header -->
      <div class="flex items-center space-x-3">
        <h2 class="text-lg font-semibold">{{ dateGroup.date }}</h2>
        <span class="text-sm text-gray-400">{{ dateGroup.day }}</span>
      </div>

      <!-- Homework Items -->
      <div class="space-y-3">
        <div
          v-for="homework in dateGroup.items"
          :key="homework.id"
          class="flex items-center justify-between shadow-lg border border-blue-200 rounded-lg bg-blue-50 rounded-lg p-4 hover:bg-gray-750 cursor-pointer hover:scale-101 transition-transform duration-200 ease-in-out"
        >
          <div class="flex items-center space-x-4">
            <!-- Subject Icon -->
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-orange-500',
              ]"
            >
              {{ homework.subject.charAt(0).toUpperCase() }}
            </div>

            <!-- Homework Details -->
            <div class="flex-1">
              <h3 class="font-medium text-gray-900 mb-1">
                {{ homework.title }}
              </h3>
              <div class="flex items-center space-x-4 text-sm text-gray-400">
                <span>Submitted at {{ homework.submittedAt }}</span>
                <span>{{ homework.courseCode }}</span>
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="flex items-center space-x-2">
            <div
              :class="[
                'px-3 py-1 rounded-md text-xs font-medium flex items-center space-x-1',
                getStatusColor(homework.status),
              ]"
            >
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span>{{ homework.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AssignmentsWithSubmission,
  GroupedAssignmentByDate,
} from "@/types/assignment";
import { computed } from "vue";
import { getDayAsText } from "@/components/common/timetable/timetableUtils";

const props = defineProps<{
  scrollContainer: HTMLElement | null;
  assignmentsList: AssignmentsWithSubmission[];
}>();

const groupedAssignments = computed<GroupedAssignmentByDate[]>(() => {
  const grouped: Record<string, AssignmentsWithSubmission[]> = {};

  props.assignmentsList.forEach((assignment) => {
    const date = new Date(assignment.assignment.deadline).toLocaleDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(assignment);
  });

  return Object.entries(grouped).map(([date, items]) => {
    const day = getDayAsText(new Date(date));

    return {
      date,
      day,
      items,
    };
  });
});

const getStatusColor = (status: string) => {
  const colors = {
    "Turned in": "bg-lime-500/60 text-green-700",
    "Past due": "bg-red-500/20 text-red-400",
    Upcoming: "bg-blue-500/20 text-blue-400",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400";
};
</script>
