import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { success, failure } from "@/utils/resultPattern";
import { ROLES, ROUTE_NAMES } from "@/constants.js";
import {
  clearAllTokens,
  extractClaimsFromToken,
  getAuthToken,
  getRefreshToken,
  isTokenExpired,
  isTokenRemembered,
  storeTokens,
} from "@/utils/tokenUtils.js";

const initialUser = () => ({
  role: null,
  institutionDomain: null,
  institutionId: null,
  userId: null,
  email: null,
});

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    refreshToken: null,
    user: initialUser(),
    isInitialized: false,
    loginAttempts: 0,
    lastLoginError: null,
  }),

  getters: {
    isAuthenticated: (state) => {
      return !!state.token && !!state.user.role && !state.isTokenExpired;
    },

    isTokenExpired: (state) => {
      if (!state.token) return true;
      return isTokenExpired(state.token);
    },

    userId: (state) => state.user.userId,
    userRole: (state) => state.user.role,
    institutionDomain: (state) => state.user.institutionDomain,
    institutionId: (state) => state.user.institutionId,

    hasRole: (state) => (role) => state.user.role === role,
    hasAnyRole: (state) => (roles) => roles.includes(state.user.role),

    isStudent: (state) => state.user.role === ROLES.STUDENT,
    isInstitutionMember: (state) =>
      state.user.role === ROLES.INSTITUTION_MEMBER,

    defaultRoute: (state) => {
      if (!state.user.role || !state.user.institutionDomain) return null;

      const routeName =
        state.user.role === ROLES.STUDENT
          ? ROUTE_NAMES.STUDENT_HOME
          : ROUTE_NAMES.TEACHER_HOME;

      return {
        name: routeName,
        params: { institutionDomain: state.user.institutionDomain },
      };
    },

    institutionClaims: (state) => ({
      institutionDomain: state.user.institutionDomain,
      institutionId: state.user.institutionId,
    }),
  },

  actions: {
    async login(credentials) {
      const { username, password, rememberMe = false } = credentials;

      if (!username?.trim() || !password?.trim()) {
        return failure("Username and password are required");
      }

      const loginResult = await authService.login(username, password);

      if (loginResult.isFailure) {
        this._handleFailedLogin(loginResult.error);
        return loginResult;
      }

      const { accessToken, refreshToken } = loginResult.data;
      const result = this._setTokens(accessToken, refreshToken, rememberMe);

      if (result.isFailure) return result;

      this.loginAttempts = 0;
      this.isInitialized = true;
      return success({
        user: this.user,
        token: this.token,
        message: "Login successful",
      });
    },

    async logout() {
      await authService.logout();
      this._clearAuthState();
    },

    async logoutAll() {
      await authService.logoutAll();
      this._clearAuthState();
    },

    async initializeAuth() {
      if (this.isInitialized) return success(true);

      // Listen for token expiration events from API interceptor
      //window.addEventListener('auth:token-expired', this._clearAuthState);

      const token = getAuthToken();
      const refreshToken = getRefreshToken();

      if (isTokenExpired(token)) {
        const result = await this.refreshTokens();
        if (result.isFailure) {
          this._clearAuthState();
          return failure("Token is expired, please log in again");
        }
      } else {
        const remembered = isTokenRemembered();
        const result = this._setTokens(token, refreshToken, remembered);

        if (result.isFailure) {
          failure("Token is invalid, please log in again");
          this._clearAuthState();
        }
      }

      this.isInitialized = true;
      return success(true);
    },

    async refreshTokens() {
      const token = this.refreshToken || getRefreshToken();
      if (token) return failure("No refresh token available");

      const refreshResult = await authService.refreshToken();
      if (refreshResult.isFailure) {
        this._clearAuthState();
        return refreshResult;
      }

      const { accessToken, refreshToken } = refreshResult.data;
      const remembered = isTokenRemembered();
      return this._setTokens(accessToken, refreshToken, remembered);
    },

    _setTokens(accessToken, refreshToken, rememberMe = false) {
      if (!accessToken || !refreshToken) {
        return failure("Missing tokens");
      }

      const claimsResult = extractClaimsFromToken(accessToken);
      if (!claimsResult.isSuccess) return failure("Invalid token claims");

      this.user = { ...initialUser(), ...claimsResult.data };
      this.token = accessToken;
      this.refreshToken = refreshToken;
      storeTokens(accessToken, refreshToken, rememberMe);
      return success(true);
    },

    _handleFailedLogin(error) {
      this.loginAttempts += 1;
      this.lastLoginError = error;
      this._clearAuthState();
    },

    _clearAuthState() {
      this.token = null;
      this.refreshToken = null;
      this.user = initialUser();
      this.lastLoginError = null;
      this.isInitialized = false;
      clearAllTokens();
    },
  },
});
