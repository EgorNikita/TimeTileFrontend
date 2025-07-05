<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useAuthStore } from "@/store/modules/auth";
import navItems from "@/navigation/studentNav.js"; // or studentNav based on role
import Sidebar from "@/components/common/Sidebar.vue";
import { useStudentStore } from "@/store/modules/student.js";
import { storeToRefs } from "pinia";
import { useInstitutionStore } from "@/store/modules/institution.js";
import router from "@/router/router.js";
import { ROUTE_NAMES } from "@/constants.js";

const auth = useAuthStore();
const studentStore = useStudentStore();
const institutionStore = useInstitutionStore();

const { student, fullName, avatarUrl } = storeToRefs(studentStore);

const sidebarRef = ref(null);
const showUserMenu = ref(false);

// Example teams data (optional)
const teams = ref([
  { id: 1, name: "Mathematics Dept", href: "#", initial: "M", current: false },
  { id: 2, name: "Science Dept", href: "#", initial: "S", current: false },
  { id: 3, name: "Admin Team", href: "#", initial: "A", current: false },
]);

const visibleNavItems = computed(() =>
  navItems.filter((item) => {
    if (!item.permissions) return true;
    return item.permissions.every((p) => student.permissions.includes(p));
  }),
);

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    showUserMenu.value = false;
  }
};

const logout = async () => {
  try {
    await auth.logout();
    await router.replace({ name: ROUTE_NAMES.LOGIN });
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);

  const studentId = auth.userId;
  const institutionId = auth.institutionId;

  if (!studentId) {
    console.warn("No student ID present in auth store");
    return;
  }

  if (!institutionId) {
    console.warn("No institution ID present in auth store");
    return;
  }

  const studentResult = await studentStore.fetchStudentById(studentId);
  const institutionResult =
    await institutionStore.fetchInstitutionById(institutionId);

  if (!studentResult.isSuccess) {
    console.error("Failed to fetch student data:", studentResult.error);
  }

  if (!institutionResult.isSuccess) {
    console.error("Failed to fetch institution data:", institutionResult.error);
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar Component -->
    <Sidebar
      ref="sidebarRef"
      :nav-items="visibleNavItems"
      :teams="teams"
      :school-name="institutionStore.institution.title || 'Institution Name'"
    />

    <!-- Main content area -->
    <div class="lg:pl-72 flex flex-col flex-1">
      <!-- Top header bar -->
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
      >
        <!-- Mobile menu button -->
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          @click="sidebarRef?.toggleSidebar()"
        >
          <span class="sr-only">Open sidebar</span>
          <svg
            class="size-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>

        <!-- Separator -->
        <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

        <!-- Header content -->
        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <!-- Search -->
          <form class="grid flex-1 grid-cols-1" action="#" method="GET">
            <input
              type="search"
              name="search"
              aria-label="Search"
              class="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6"
              placeholder="Search..."
            />
            <svg
              class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </form>

          <!-- Right side items -->
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <!-- Notifications -->
            <button
              type="button"
              class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">View notifications</span>
              <svg
                class="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

            <!-- Separator -->
            <div
              class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            />

            <!-- Profile dropdown -->
            <div class="relative">
              <button
                type="button"
                class="-m-1.5 flex items-center p-1.5"
                @click="showUserMenu = !showUserMenu"
              >
                <span class="sr-only">Open user menu</span>
                <img
                  class="size-8 rounded-md bg-gray-50"
                  :src="
                    avatarUrl ||
                    'https://plus.unsplash.com/premium_vector-1724790120830-587ead1ffa26?q=80&w=882&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  "
                  :alt="fullName"
                />
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm/6 font-semibold text-gray-900">{{
                    fullName || "???"
                  }}</span>
                  <svg
                    class="ml-2 size-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </button>

              <!-- User dropdown menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5"
                @click="showUserMenu = false"
              >
                <a
                  href="#"
                  class="block px-3 py-1 text-sm/6 text-gray-900 hover:bg-gray-50"
                  >Your profile</a
                >
                <button
                  @click="logout"
                  class="block w-full text-left px-3 py-1 text-sm/6 text-gray-900 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content -->
      <main class="flex-1 overflow-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>
