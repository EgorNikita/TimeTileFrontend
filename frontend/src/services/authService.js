import { success, failure } from "@/utils/resultPattern.js";
import { createApi } from "@/utils/apiClient.ts";
import { clearAllTokens } from "@/utils/tokenUtils.js";

const apiClient = createApi();

export const authService = {
  async login(username, password) {
    if (!username?.trim() || !password?.trim()) {
      return failure({
        message: "Username and password are required",
        code: "INVALID_CREDENTIALS",
      });
    }

    const loginResult = await apiClient.post("/auth/login", {
      Login: username,
      Password: password,
    });

    if (loginResult.isSuccess) {
      const { accessToken, refreshToken } = loginResult.data;

      if (!accessToken || !refreshToken) {
        return failure({
          message: "Invalid response from server - missing tokens",
          code: "INVALID_RESPONSE",
        });
      }

      return success({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }

    return loginResult;
  },

  async logout(refreshToken) {
    if (refreshToken) {
      try {
        await apiClient.post("/auth/logout", {
          RefreshToken: refreshToken,
        });
      } catch (error) {
        console.warn("Logout request failed:", error);
        // Continue with local cleanup even if remote logout fails
      }
    }

    clearAllTokens();
    return success(true);
  },

  async logoutAll() {
    try {
      await apiClient.post("/auth/logout-all");
    } catch (error) {
      console.warn("Logout all request failed:", error);
    }

    clearAllTokens();
    return success(true);
  },

  async refreshToken(refreshToken) {
    if (!refreshToken) {
      return failure({
        message: "No refresh token available",
        code: "NO_REFRESH_TOKEN",
      });
    }

    const refreshResult = await apiClient.post("/auth/refresh", {
      RefreshToken: refreshToken,
    });

    if (refreshResult.isSuccess) {
      const { accessToken: AccessToken, refreshToken: NewRefreshToken } =
        refreshResult.data;

      if (!AccessToken || !NewRefreshToken) {
        return failure({
          message: "Invalid refresh response - missing tokens",
          code: "INVALID_REFRESH_RESPONSE",
        });
      }

      return success({
        accessToken: AccessToken,
        refreshToken: NewRefreshToken,
      });
    }

    // Refresh failed, clear tokens
    clearAllTokens();
    return failure({
      message: refreshResult.error?.message || "Token refresh failed",
      code: refreshResult.error?.code || "REFRESH_FAILED",
      type: refreshResult.error?.type,
      details: refreshResult.error?.details,
    });
  },
};
