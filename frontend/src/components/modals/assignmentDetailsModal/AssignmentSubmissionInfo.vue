<template>
  <div class="bg-green-100 border border-green-200 rounded-lg p-4 mb-6">
    <div class="flex flex-col items-start justify-center">
      <h3 class="font-medium text-gray-800 mb-2 flex items-center">
        <CheckCircleIcon class="w-5 h-5 mr-2" />
        Submission Details
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-800 pl-3">
            <span class="font-medium">Submitted at:</span>
            {{ formatDateTo21May2025at(submission.submittedAt ?? "") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Student Note Section -->
    <div v-if="submission.studentNote" class="mt-3">
      <p class="text-sm font-medium text-gray-800">Student Note:</p>
      <p class="text-sm text-green-700 mt-1 bg-white/50 p-3 rounded border">
        {{ submission.studentNote }}
      </p>
    </div>

    <!-- Files Section -->
    <SubmissionFileList
      v-if="submission.fileUrls && submission.fileUrls.length > 0"
      :file-urls="submission.fileUrls"
      class="mt-3"
    />
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
import { formatDateTo21May2025at } from "@/utils/dateUtils";
import { EnrichedSubmissionWithFiles } from "@/types/assignment";
import SubmissionFileList from "@/components/modals/assignmentDetailsModal/SubmissionFileList.vue";

const props = defineProps<{
  submission: EnrichedSubmissionWithFiles;
}>();
</script>
