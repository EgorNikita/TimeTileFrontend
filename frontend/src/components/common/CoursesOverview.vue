<script setup>
import CourseCard from "@/components/common/CourseCard.vue";
import { UserGroupIcon } from "@heroicons/vue/24/outline";
import draggable from "vuedraggable";
import { ref } from "vue";

// Make projects reactive so we can reorder them
const projects = ref([
  {
    id: 1, // Add unique IDs for better tracking
    name: "GY23x_Stufengruppe",
    initials: "GA",
    href: "#",
    members: 16,
    bgColor: "bg-pink-600",
  },
  {
    id: 2,
    name: "GYI231_LKI_PLUM",
    initials: "CD",
    href: "#",
    members: 12,
    bgColor: "bg-purple-600",
  },
  {
    id: 3,
    name: "Spanischkurs_May_GYx23x",
    initials: "RC",
    href: "#",
    members: 8,
    bgColor: "bg-green-500",
  },
  {
    id: 4,
    name: "GYI231_GK_BWL_Pascher",
    initials: "RC",
    href: "#",
    members: 8,
    bgColor: "bg-green-500",
  },
  {
    id: 5,
    name: "LKM_GYI231_FRA",
    initials: "T",
    href: "#",
    members: 16,
    bgColor: "bg-yellow-500",
  },
  {
    id: 6,
    name: "GY22_23_24_Philosophie_Pascher",
    initials: "T",
    href: "#",
    members: 16,
    bgColor: "bg-yellow-500",
  },
]);

const dragging = ref(false);

// Optional: Handle drag events
const onDragStart = () => {
  dragging.value = true;
  console.log("Drag started");
};

const onDragEnd = () => {
  dragging.value = false;
  console.log("Drag ended");
  console.log(
    "New order:",
    projects.value.map((p) => p.name),
  );

  // Here you could save the new order to your backend
  // saveCoursesOrder(projects.value);
};

const onDragChange = (evt) => {
  console.log("Drag change:", evt);
};
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow-md sm:px-6 sm:pt-6"
  >
    <div class="flex items-center space-x-2">
      <UserGroupIcon class="size-6 shrink-0 text-gray-900" />
      <h2 class="text-lg font-bold text-gray-900">Courses</h2>
    </div>

    <draggable
      v-model="projects"
      tag="div"
      class="mt-3 grid flex-wrap gap-4"
      style="grid-template-columns: repeat(auto-fit, minmax(270px, 1fr))"
      :animation="200"
      ghost-class="ghost-card"
      chosen-class="chosen-card"
      drag-class="drag-card"
      :force-fallback="false"
      :scroll-sensitivity="100"
      :scroll-speed="10"
      @start="onDragStart"
      @end="onDragEnd"
      @change="onDragChange"
      item-key="id"
    >
      <template #item="{ element: project }">
        <div class="course-item">
          <CourseCard :course="project" />
        </div>
      </template>
    </draggable>
  </div>
</template>
