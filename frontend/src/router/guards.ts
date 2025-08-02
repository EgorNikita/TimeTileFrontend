import type { Router, RouteLocationNormalized } from "vue-router";
import { ROUTE_NAMES } from "@/constants";
import { useAuth } from "@/composables/useAuth";
import { AppRouteMeta } from "@/router/router";
import { goToDefaultRoute } from "@/router/navigation";

export function setupNavigationGuards(router: Router) {
  router.beforeEach(async (to, _, next) => {
    const { auth, user, institution } = useAuth();

    const userData = user.currentUser.value;
    const institutionData = institution.currentInstitution.value;

    const meta = to.meta as AppRouteMeta;

    // Public
    if (meta.isPublic) {
      if (meta.hideForAuthenticated && auth.isAuthenticated && userData) {
        await goToDefaultRoute();
      }
      return next();
    }

    // Auth check
    if (!auth.isAuthenticated || !userData || !institutionData) {
      return next({
        name: ROUTE_NAMES.LOGIN,
        query: { redirect: to.fullPath },
      });
    }

    // Domain check
    if (
      to.params.institutionDomain &&
      to.params.institutionDomain !== institutionData.domain
    ) {
      return next({
        name: to.name!,
        params: {
          ...to.params,
          institutionDomain: institutionData.domain,
        },
        query: to.query,
      });
    }

    // // Permission check
    // const requiredPermissions = (to.meta?.permissions as string[]) || [];
    // if (!requiredPermissions.every(auth.hasPermission)) {
    //   return next({ name: "Unauthorized" });
    // }

    next();
  });

  router.afterEach((to: RouteLocationNormalized) => {
    const meta = to.meta as AppRouteMeta;
    document.title = meta?.title ?? "TimeTile";
  });
}
