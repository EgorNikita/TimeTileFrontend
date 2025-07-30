import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { baseRoutes } from "@/router/routes/baseRoutes";
import { setupNavigationGuards } from "@/router/guards";
import { studentRoutes } from "@/router/routes/studentRoutes";
import { teacherRoutes } from "@/router/routes/teacherRoutes";

export interface AppRouteMeta {
  title?: string;
  isPublic?: boolean;
  hideForAuthenticated?: boolean;
  role?: string;
  permissions?: string[];
}

const routes: RouteRecordRaw[] = [
  ...baseRoutes,
  ...studentRoutes,
  ...teacherRoutes,
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

setupNavigationGuards(router);

export default router;
