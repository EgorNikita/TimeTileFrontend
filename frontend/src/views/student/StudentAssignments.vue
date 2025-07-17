<template>
  <div class="flex flex-col flex-1 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">
        Assignments Dashboard
      </h1>
      <button class="text-gray-400 hover:text-white">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>

    <div class="flex-1 bg-white rounded-lg shadow-lg p-5">
      <!-- Tabs -->
      <div class="flex items-baseline space-x-4 mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'rounded-md px-3 py-2 text-md font-medium bg-gray-100 cursor-pointer',
            activeTab === tab.id
              ? 'bg-gray-900 text-white'
              : 'text-gray-400 hover:bg-gray-200',
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Homework List -->
      <div class="space-y-6">
        <div
          v-for="dateGroup in filteredHomework"
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
                    'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm',
                    getSubjectColor(homework.subject),
                  ]"
                >
                  {{ homework.subject.charAt(0).toUpperCase() }}
                </div>

                <!-- Homework Details -->
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900 mb-1">
                    {{ homework.title }}
                  </h3>
                  <div
                    class="flex items-center space-x-4 text-sm text-gray-400"
                  >
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
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

const tabs = [
  { id: "upcoming", name: "Upcoming" },
  { id: "past_due", name: "Past due" },
  { id: "completed", name: "Completed" },
];

const activeTab = ref(tabs[0].id);
</script>
