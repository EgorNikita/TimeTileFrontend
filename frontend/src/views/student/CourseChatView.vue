<template>
  <div class="flex flex-col h-full overflow-y-auto">
    <div
      class="m-2 sm:m-6 lg:m-10 flex flex-col h-full bg-white shadow-md rounded-lg overflow-hidden"
    >
      <!-- Course Header -->
      <CourseHeader :course="course" />

      <!-- Messages Container -->
      <div class="flex-1 overflow-hidden flex flex-col">
        <UpwardsLazyScrollWrapper
          class="px-2 sm:ml-4 sm:pr-1 space-y-2 sm:space-y-4"
          :query="messageQuery"
        >
          <div class="pr-2 sm:pr-4 mb-2 sm:mb-4 flex flex-col-reverse">
            <template v-for="group in groupedMessagesByDate" :key="group.id">
              <div class="space-y-2 sm:space-y-4">
                <!-- Date Divider -->
                <div class="flex items-center my-4 sm:my-6">
                  <div class="flex-1 h-px bg-gray-200"></div>
                  <div
                    class="px-2 sm:px-4 py-1 text-xs font-semibold text-gray-500 bg-gray-50 rounded uppercase tracking-wide"
                  >
                    {{ formatDateDivider(group.date) }}
                  </div>
                  <div class="flex-1 h-px bg-gray-200"></div>
                </div>

                <!-- Messages under that date -->
                <MessageBubble
                  v-for="message in group.messages"
                  :key="message.id"
                  :message="message"
                  :is-own-message="
                    message.userId === user.currentUser.value?.id
                  "
                />
              </div>
            </template>
          </div>
        </UpwardsLazyScrollWrapper>
      </div>

      <!-- Message Input -->
      <MessageInputArea @send-message="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import { useMessagesWithRealTime } from "@/composables/useMessagesWithRealTime";
import { computed } from "vue";
import { useAuth } from "@/composables/useAuth";
import MessageBubble from "@/components/common/chat/MessageBubble.vue";
import MessageInputArea from "@/components/common/chat/MessageInputArea.vue";
import CourseHeader from "@/components/common/chat/CourseHeader.vue";
import { useBulkCoursesEnrichedWithSubject } from "@/tanStackQueries/student/course/useBulkCoursesEnrichedWithSubject";
import UpwardsLazyScrollWrapper from "@/components/common/UpwardsLazyScrollWrapper.vue";
import { MessageEnrichedWithUserInfo } from "@/tanStackQueries/student/message/useMessagesWithStudent";
import { useSignalRStore } from "@/stores/SignalRStore";
import { messageApi } from "@/services/messageApi";

interface DatedMessageGroup {
  id: string;
  date: Date;
  messages: MessageEnrichedWithUserInfo[];
}

const route = useRoute();
const courseId = Number.parseInt(route.params.courseId as string);

const { user } = useAuth();

const messageQuery = useMessagesWithRealTime({
  courseIds: [courseId],
  sortBy: "sentAt",
  descending: true,
});

const { send } = useSignalRStore();

const courseQuery = useBulkCoursesEnrichedWithSubject([courseId]);

const course = computed(() => courseQuery.data.value?.[0] ?? null);

const messages = computed(
  () => messageQuery.data.value?.pages.flatMap((p) => p.items) ?? [],
);

const groupedMessagesByDate = computed<DatedMessageGroup[]>(() => {
  if (!messages.value.length) return [];

  const groupsMap = new Map<string, DatedMessageGroup>();

  for (const msg of [...messages.value].reverse()) {
    const date = new Date(msg.sentAt);
    const dateKey = date.toDateString();

    if (!groupsMap.has(dateKey)) {
      groupsMap.set(dateKey, {
        date,
        id: `divider-${dateKey}`,
        messages: [],
      });
    }

    groupsMap.get(dateKey)!.messages.push(msg);
  }

  // Convert map to array and sort descending (newest date first)
  return Array.from(groupsMap.values()).reverse();
});

const formatDateDivider = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const messageDate = new Date(date);

  console.log("formatDateDivider", {
    today: today.toDateString(),
    yesterday: yesterday.toDateString(),
    messageDate: messageDate.toDateString(),
  });

  if (messageDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (messageDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  if (messageDate.getFullYear() === today.getFullYear()) {
    return messageDate.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
    });
  }

  return messageDate.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const handleSendMessage = async (content: string, selectedFiles?: File[]) => {
  if (selectedFiles?.length) {
    await messageApi.sendMessage({
      courseId: courseId,
      content: content.trim(),
      files: selectedFiles,
    });
  } else {
    await send("SendMessage", courseId, content);
  }
};
</script>
