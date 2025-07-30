<script setup lang="ts">
import { computed, ComputedRef, ref, watch, watchEffect } from "vue";
import LazyScrollWrapper from "@/components/common/LazyScrollWrapper.vue";
import { useAssignmentsWithSubmission } from "@/tanStackQueries/student/assignment/useAssignmentsWithSubmission";
import { useBulkCourses } from "@/tanStackQueries/student/course/useBulkCourses";
import { EnrichedAssignmentWithSubmission } from "@/types/assignment";
import AssignmentPreviewCard from "@/components/student/AssignmentPreviewCard.vue";
import { Course } from "@/types/course";

const assignmentsQuery = useAssignmentsWithSubmission({});

const assignments = computed(
  () => assignmentsQuery.data.value?.pages?.flatMap((page) => page.items) ?? [],
);

const uniqueCourseIds = computed(() => {
  const courseIds = assignments.value.map(
    (assignment) => assignment.assignment.courseId,
  );
  return [...new Set(courseIds)];
});

const coursesQuery = useBulkCourses(uniqueCourseIds);

const fetchedCourses = ref(new Map<number, Course>());

watchEffect(() => {
  const newCourses = coursesQuery.data.value ?? [];
  newCourses.forEach((course) => {
    fetchedCourses.value.set(course.id, course);
  });
});

const coursesMap = computed(() => fetchedCourses.value);

const enrichedAssignments: ComputedRef<EnrichedAssignmentWithSubmission[]> =
  computed(() => {
    if (assignments.value.length === 0) {
      return [];
    }

    return assignments.value
      .map((entry) => {
        const course = coursesMap.value.get(entry.assignment.courseId);

        // If course not found, skip this assignment
        if (!course) {
          return null;
        }

        return {
          assignment: {
            ...entry.assignment,
            course: course,
          },
          submission: entry.submission,
        };
      })
      .filter(
        (entry): entry is EnrichedAssignmentWithSubmission => entry !== null,
      );
  });
</script>

<template>
  <div
    class="relative bg-white rounded-xl shadow-md p-6 pr-4 flex flex-col h-full min-h-0"
  >
    <!-- Header -->
    <h2 class="text-2xl font-bold text-gray-800 mb-3 flex-shrink-0">
      Last Assignments
    </h2>

    <div class="relative mb-3">
      <div class="w-full border-t border-gray-300 shadow-lg" />
    </div>

    <!-- Grades List -->
    <LazyScrollWrapper
      class="flex-1 min-h-0 overflow-y-auto"
      :query="assignmentsQuery"
      loading-text="Loading assignments..."
    >
      <div class="space-y-2 pr-3 pl-1">
        <AssignmentPreviewCard
          v-for="assignment in enrichedAssignments"
          :key="assignment.assignment.id"
          :assignment="assignment"
          :width="300"
        />
      </div>
    </LazyScrollWrapper>
  </div>
</template>
