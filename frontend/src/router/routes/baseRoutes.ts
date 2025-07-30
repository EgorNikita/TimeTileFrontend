import { ROUTE_NAMES } from "@/constants";
import { RouteRecordRaw } from "vue-router";

export const baseRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: ROUTE_NAMES.LOGIN,
    component: () => import("@/views/LoginView.vue"),
    meta: { isPublic: true, hideForAuthenticated: true, title: "Login" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: { isPublic: true, title: "Not Found" },
  },
];
