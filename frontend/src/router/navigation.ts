import { ROUTE_NAMES } from "@/constants";
import { useAuth } from "@/composables/useAuth";
import router from "@/router/router";

export async function goToDefaultRoute() {
  const { user, institution } = useAuth();

  const userData = user.currentUser.value;
  const institutionDomain = institution.currentInstitution.value?.domain;

  if (!userData || !institutionDomain) return;

  if (userData.isStudent) {
    await router.push({
      name: ROUTE_NAMES.STUDENT_HOME,
      params: { institutionDomain },
    });
  } else {
    await router.push({
      name: ROUTE_NAMES.TEACHER_HOME,
      params: { institutionDomain },
    });
  }
}

export async function navigateSafely(to: any) {
  try {
    await router.push(to);
  } catch (err) {
    console.error("Navigation failed", err);
    await goToDefaultRoute();
  }
}
