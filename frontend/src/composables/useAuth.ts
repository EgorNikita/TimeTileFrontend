import { authApi, LoginRequest } from "@/services/authApi";
import { institutionApi } from "@/services/institutionApi";
import { useAuthStore } from "@/stores/authStore";
import { useUserStore } from "@/stores/userStore";
import { useInstitutionStore } from "@/stores/institutionStore";
import { computed } from "vue";
import { userApi } from "@/services/userApi";
import { failure, success } from "@/utils/resultPattern";

export function useAuth() {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const institutionStore = useInstitutionStore();

  // Computed properties for current user
  const currentUser = computed(() => {
    if (!authStore.currentUserId) return null;
    return userStore.user;
  });

  const currentInstitution = computed(() => {
    if (!authStore.currentInstitutionId) return null;
    return institutionStore.institution;
  });

  const fullName = computed(() => {
    if (!authStore.currentUserId) return "";
    return userStore.getFullName;
  });

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => authStore.isLoading);

  const login = async (credentials: LoginRequest) => {
    authStore.setLoading(true);

    try {
      const loginResult = await authApi.login(credentials);
      if (!loginResult.isSuccess) return loginResult;

      return await handleAuthSuccess(
        loginResult.data.userId,
        loginResult.data.institutionId,
      );
    } catch (error) {
      return handleAuthError();
    } finally {
      authStore.setLoading(false);
    }
  };

  const checkAuth = async () => {
    authStore.setLoading(true);

    try {
      const loginResult = await authApi.checkAuth();
      if (!loginResult.isSuccess) return loginResult;

      return await handleAuthSuccess(
        loginResult.data.userId,
        loginResult.data.institutionId,
      );
    } catch (error) {
      return handleAuthError();
    } finally {
      authStore.setLoading(false);
    }
  };

  const logout = async () => {
    authStore.setLoading(true);

    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear all stores
      authStore.clearAuth();
      authStore.setLoading(false);

      userStore.clearUser();
      institutionStore.clearInstitution();
    }
  };

  //internal
  const loadUserData = async (studentId: number, institutionId: number) => {
    try {
      // Load user data
      userStore.setLoading(true);
      const studentData = await userApi.getUserById(studentId);

      userStore.setUser(studentData);

      // Load institution data
      institutionStore.setLoading(true);
      const institutionData =
        await institutionApi.getInstitutionById(institutionId);
      if (!institutionData.isSuccess) {
        return { success: false, error: institutionData.error };
      }
      institutionStore.setInstitution(institutionData.data);
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      userStore.setLoading(false);
      institutionStore.setLoading(false);
    }
  };

  const handleAuthSuccess = async (userId: number, institutionId: number) => {
    // 1. Set auth state
    authStore.setAuthenticated(userId, institutionId);

    // 2. Fetch and store user data
    await loadUserData(userId, institutionId);

    return success({ userId, institutionId });
  };

  const handleAuthError = (message = "Failed to complete login process") => {
    authStore.clearAuth();
    return failure(message);
  };

  return {
    auth: {
      isAuthenticated: isAuthenticated,
      isLoading: isLoading,
      login,
      checkAuth,
      logout,
    },
    user: {
      currentUser,
      fullName,
    },
    institution: {
      currentInstitution,
    },
  };
}
