<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { ROUTE_NAMES } from "@/constants";
import stelarLogoUrl from "@/assets/images/stelar_logo.svg?url";

interface NavItem {
  name: string;
  label: string;
  icon: any;
}

interface Team {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
}

const props = defineProps<{
  navItems: NavItem[];
  teams?: Team[];
  schoolName?: string;
}>();

const sidebarOpen = ref(false);

/* ---------- auth + routing ---------- */
const { institution } = useAuth();
const route = useRoute();

const institutionDomain = computed(
  () => institution.currentInstitution?.value?.domain || "",
);

const isCurrentRoute = (routeName: string): boolean => {
  return route.name === routeName;
};

defineExpose({
  toggleSidebar: () => {
    sidebarOpen.value = !sidebarOpen.value;
  },
  closeSidebar: () => {
    sidebarOpen.value = false;
  },
});
</script>

<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="relative z-50 lg:hidden">
      <div
        class="fixed inset-0 bg-gray-900/80"
        @click="sidebarOpen = false"
      ></div>

      <div class="fixed inset-0 flex">
        <div
          class="relative mr-16 flex w-full max-w-xs flex-1 transform transition-transform duration-300"
          :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
        >
          <!-- Close button -->
          <div class="absolute top-0 left-full flex w-16 justify-center pt-5">
            <button
              type="button"
              class="-m-2.5 p-2.5"
              @click="sidebarOpen = false"
            >
              <span class="sr-only">Close sidebar</span>
              <svg
                class="size-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Mobile sidebar content -->
          <div
            class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10"
          >
            <div class="flex h-16 shrink-0 items-center">
              <img
                class="h-10 w-auto"
                :src="stelarLogoUrl"
                :alt="schoolName || 'School Logo'"
              />
              <span v-if="schoolName" class="ml-3 text-white font-semibold">{{
                schoolName
              }}</span>
            </div>

            <nav class="flex flex-1 flex-col">
              <ul role="list" class="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" class="-mx-2 space-y-1">
                    <li v-for="item in navItems" :key="item.name">
                      <RouterLink
                        :to="{
                          name: item.name,
                          params: { institutionDomain },
                        }"
                        class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors"
                        :class="
                          isCurrentRoute(item.name)
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        "
                        @click="sidebarOpen = false"
                      >
                        <component
                          :is="item.icon"
                          class="size-6 shrink-0"
                          aria-hidden="true"
                        />
                        {{ item.label }}
                      </RouterLink>
                    </li>
                  </ul>
                </li>

                <!-- Teams section (if you have teams) -->
                <li v-if="teams && teams.length">
                  <div class="text-xs/6 font-semibold text-gray-400">
                    Your teams
                  </div>
                  <ul role="list" class="-mx-2 mt-2 space-y-1">
                    <li v-for="team in teams" :key="team.name">
                      <a
                        :href="team.href"
                        class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <span
                          class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white"
                        >
                          {{ team.initial }}
                        </span>
                        <span class="truncate">{{ team.name }}</span>
                      </a>
                    </li>
                  </ul>
                </li>

                <!-- Settings link -->
                <li class="mt-auto">
                  <RouterLink
                    :to="{
                      name: ROUTE_NAMES.LOGIN,
                      params: { institutionDomain },
                    }"
                    class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <svg
                      class="size-6 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </RouterLink>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop sidebar -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
    >
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img
            class="h-12 w-auto"
            :src="stelarLogoUrl"
            :alt="schoolName || 'School Logo'"
          />
          <span v-if="schoolName" class="ml-3 text-white font-semibold">{{
            schoolName
          }}</span>
        </div>

        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <li v-for="item in navItems" :key="item.name">
                  <RouterLink
                    :to="{
                      name: item.name,
                      params: { institutionDomain },
                    }"
                    class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors"
                    :class="
                      isCurrentRoute(item.name)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    "
                  >
                    <component
                      :is="item.icon"
                      class="size-6 shrink-0"
                      aria-hidden="true"
                    />
                    {{ item.label }}
                  </RouterLink>
                </li>
              </ul>
            </li>

            <!-- Teams section (if you have teams) -->
            <li v-if="teams && teams.length">
              <div class="text-xs/6 font-semibold text-gray-400">
                Your teams
              </div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="team in teams" :key="team.name">
                  <a
                    :href="team.href"
                    class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <span
                      class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white"
                    >
                      {{ team.initial }}
                    </span>
                    <span class="truncate">{{ team.name }}</span>
                  </a>
                </li>
              </ul>
            </li>

            <!-- Settings link -->
            <li class="mt-auto">
              <RouterLink
                :to="{
                  name: ROUTE_NAMES.LOGIN,
                  params: { institutionDomain },
                }"
                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <svg
                  class="size-6 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>
