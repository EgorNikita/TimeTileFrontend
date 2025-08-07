<template>
  <div class="flex group" :class="{ 'justify-end': isOwnMessage }">
    <div
      class="flex max-w-xs lg:max-w-md xl:max-w-lg"
      :class="{ 'flex-row-reverse': isOwnMessage }"
    >
      <!-- Avatar -->
      <div
        class="flex-shrink-0 mt-5"
        :class="{ 'ml-3': isOwnMessage, 'mr-3': !isOwnMessage }"
      >
        <div class="relative">
          <img
            class="h-9 w-9 rounded-lg object-cover shadow-md transition-transform duration-200"
            :src="message.user?.avatarUrl || defaultAvatar"
            :alt="fullName"
            @error="handleAvatarError"
          />
        </div>
      </div>

      <!-- Message Content -->
      <div class="flex flex-col space-y-1 min-w-0">
        <!-- Sender Name & Time -->
        <div
          class="text-xs text-gray-500 px-3 flex items-center gap-2"
          :class="{ 'flex-row-reverse': isOwnMessage }"
        >
          <span class="font-semibold text-gray-700">{{ fullName }}</span>
          <span class="text-gray-400">•</span>
          <span class="text-gray-400">{{ formatTime(message.sentAt) }}</span>
          <span
            v-if="message.EditedAt"
            class="text-xs text-gray-400 italic bg-gray-100 px-1.5 py-0.5 rounded-full"
          >
            edited
          </span>
        </div>

        <!-- Message Bubble -->
        <div
          v-if="message.content && message.content.trim()"
          class="relative px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md"
          :class="messageBubbleClasses"
        >
          <p class="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {{ message.content }}
          </p>
        </div>

        <div
          v-if="message.fileUrls && message.fileUrls.length > 0"
          class="relative px-4 py-2 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md max-w-xs"
          :class="messageBubbleClasses"
        >
          <!-- File Attachments -->
          <SubmissionFileList :file-urls="message.fileUrls" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MessageEnrichedWithUserInfo } from "@/tanStackQueries/student/message/useMessagesWithStudent";
import SubmissionFileList from "@/components/modals/assignmentDetailsModal/SubmissionFileList.vue";

interface Props {
  message: MessageEnrichedWithUserInfo;
  isOwnMessage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isOwnMessage: false,
});

const defaultAvatar =
  "https://plus.unsplash.com/premium_vector-1724790120830-587ead1ffa26?q=80&w=882&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const fullName = computed(() => {
  const { firstname = "", lastname = "" } = props.message.user || {};
  return `${firstname} ${lastname}`.trim() || "Anonymous";
});

const messageBubbleClasses = computed(() => {
  return props.isOwnMessage
    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white ml-2"
    : "bg-white text-gray-800 border border-gray-200 mr-2 hover:border-gray-300";
});

const formatTime = (date: Date) => {
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

const handleAvatarError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.src = defaultAvatar;
};
</script>
