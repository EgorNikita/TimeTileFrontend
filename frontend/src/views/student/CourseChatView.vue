<script setup lang="ts">

import { useRoute } from 'vue-router'
import { useMessages } from "@/tanStackQueries/student/message/useMessages";

const route = useRoute()
const courseId = Number.parseInt(route.params.courseId as string)

const messagesQuery = useMessages({
  courseIds: [courseId],
  sortBy: 'sentAt',
  descending: true
});

const messages = computed(
  () =>
    messagesQuery.data.value?.pages?.flatMap((page) => page.items) ??
    [],
);

</script>

<template>
  <p>asd</p>
  <p>{{courseId}}</p>
</template>