<script setup>
import { computed, onMounted, ref, watch } from "vue";
import GradesPreviewCard from "./GradesPreviewCard.vue";
import { useGradesStore } from "@/store/modules/gradesStore.js";

// Make projects reactive so we can reorder them
const props = defineProps({
  contextKey: {
    type: String,
    default: "grades",
  },
  filters: {
    type: Object,
    default: () => ({}),
  }
});

const gradeStore = useGradesStore();

// Computed properties for reactive gradeStore data
const grades = computed(() => gradeStore.getGrades(props.contextKey));
const isLoading = computed(() => gradeStore.loading);
const hasMore = computed(() => gradeStore.hasMoreGrades(props.contextKey));

const loadGrades = async () => {
  const result = await gradeStore.loadGrades(
    props.contextKey,
    props.filters,
  );
  if (result.isFailure) {
    console.error("Failed to load courses:", result.error);
  }
};

onMounted(async () => {
  await loadGrades();
});

const scrollContainer = ref(null);

function handleScroll() {
  const container = scrollContainer.value;
  if (!container) return;

  // Check if we're near the bottom (e.g., within 100px)
  if (container.scrollHeight - container.scrollTop - container.clientHeight < 100) {
    loadMoreGrades();
  }
}

async function loadMoreGrades() {
  if (isLoading.value || !hasMore.value) return;

  await gradeStore.loadGrades(props.contextKey, props.filters, true);
}


</script>

<template>
  <div class="relative bg-white rounded-xl shadow-lg p-6 pr-4 flex flex-col max-w-[25vw]">
    <!-- Header -->
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex-shrink-0">
      Нові оцінки
    </h2>

    <!-- Grades List -->
    <div
      ref="scrollContainer"
      class="flex-1 overflow-y-auto min-h-0 custom-scrollbar max-h-[60vh]"
      @scroll="handleScroll"
    >
      <div class="space-y-4 pr-3">
        <GradesPreviewCard
          v-for="grade in grades"
          :key="grade.id"
          :grade="grade.value"
          :subject-id="grade.subjectId"
          :type="grade.type"
          :date="grade.date"
        />
      </div>
    </div>
  </div>
</template>
