<script setup>
import { defineAsyncComponent } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: "w-6 h-6", // Default size
  },
});

const icon = defineAsyncComponent(
  () => import(`@/assets/fileTypeIcons/${props.name}.svg`),
);
</script>

<template>
  <component :is="icon" :class="[size, 'fill-current']" />
</template>
