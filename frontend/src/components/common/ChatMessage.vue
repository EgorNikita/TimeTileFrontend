<script setup lang="ts">
import { EnrichedMessage } from "@/types/message";
import FilePreview from "@/components/modals/assignmentDetailsModal/FilePreview.vue";
import FileActionBar from "@/components/modals/assignmentDetailsModal/FileActionBar.vue";
import { computed } from "vue";

const props = defineProps<{
  message: EnrichedMessage;
  belongsToPreviousMessage: Boolean;
}>();

const hasContent = computed(() => props.message.content?.length && props.message.content?.length > 0);

// Format date helper
const formatMessageTime = (date: Date) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInHours =
    (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffInHours < 168) {
    // 7 days
    return messageDate.toLocaleDateString([], {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

</script>

<template>
  <!-- Message bubble -->
  <div
    class="flex items-start space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors duration-200"
    :class="{
              'mt-0': belongsToPreviousMessage,
              'mt-4': !belongsToPreviousMessage,
            }"
  >
    <!-- Avatar -->
    <div
      v-if="!belongsToPreviousMessage"
      class="relative flex-shrink-0"
    >
      <!-- Avatar image with fallback to initials -->
      <img
        class="w-10 h-10 rounded-full object-cover shadow-md"
        :src="message.user.avatarUrl"
        alt="`${message.user.firstname} avatar`"
      />
    </div>

    <!-- Spacer for grouped messages -->
    <div v-else class="flex-shrink-0 w-10"></div>

    <!-- Message content -->
    <div class="flex-1 min-w-0">
      <!-- User info (only show if not same user as previous) -->
      <div
        v-if="!belongsToPreviousMessage"
        class="flex items-center space-x-2 mb-1"
      >
        <span class="font-semibold text-gray-900 text-sm">
          {{ message.user.firstname }} {{ message.user.lastname }}
        </span>
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {{ formatMessageTime(message.sentAt) }}
        </span>
      </div>

      <!-- Message bubble -->
      <div class="relative">
        <div class="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-2xl"
             :class="{
               'rounded-tl-md': !belongsToPreviousMessage
             }">
          <p v-if="hasContent" class="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {{ message.content }}
          </p>

          <div v-if="message.files.length > 0">
            <div :class="{ 'mt-3': hasContent }">
              <div class="space-y-2">
                <div
                  v-for="(file, index) in message.files"
                  :key="index"
                  class="flex items-center justify-between p-3 bg-white/70 rounded-lg border border-gray-800 hover:bg-white/90 transition-colors"
                >
                  <FilePreview :file="file" />
                  <FileActionBar :file="file" />
                </div>
              </div>
            </div>
          </div>

          <!-- Edited indicator -->
          <div
            v-if="message.editedAt"
            class="flex items-center space-x-1 mt-2 pt-2 border-t border-gray-100"
          >
            <svg class="w-3 h-3 text-gray-400" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
            <span class="text-xs text-gray-400 italic">edited</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>