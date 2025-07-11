import { defineStore } from "pinia";
import { authService } from "@/services/authService";
import { success, failure } from "@/utils/resultPattern";
import { ROLES, ROUTE_NAMES } from "@/constants";
import {
  clearAllTokens,
  extractClaimsFromToken,
  getAuthToken,
  getRefreshToken,
  isTokenExpired,
  isTokenRemembered,
  storeTokens,
} from "@/utils/tokenUtils";

// Types and Interfaces
interface User {
  role: string | null;
  institutionDomain: string | null;
  institutionId: string | null;
  userId: string | null;
  email: string | null;
}

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginSuccessData {
  user: User;
  token: string;
  message: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User;
  isInitialized: boolean;
  loginAttempts: number;
  lastLoginError: string | null;
}

interface RouteConfig {
  name: string;
  params: {
    institutionDomain: string;
  };
}

interface InstitutionClaims {
  institutionDomain: string | null;
  institutionId: string | null;
}

// Helper function
const initialUser = (): User => ({
  role: null,
  institutionDomain: null,
  institutionId: null,
  userId: null,
  email: null,
});

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
    refreshToken: null,
    user: initialUser(),
    isInitialized: false,
    loginAttempts: 0,
    lastLoginError: null,
  }),

  getters: {
    isAuthenticated: (state: AuthState): boolean => {
      return !!state.token && !!state.user.role && !isTokenExpired(state.token);
    },

    isTokenExpired: (state: AuthState): boolean => {
      if (!state.token) return true;
      return isTokenExpired(state.token);
    },

    userId: (state: AuthState): string | null => state.user.userId,
    userRole: (state: AuthState): string | null => state.user.role,
    institutionDomain: (state: AuthState): string | null =>
      state.user.institutionDomain,
    institutionId: (state: AuthState): string | null =>
      state.user.institutionId,

    hasRole:
      (state: AuthState) =>
      (role: string): boolean =>
        state.user.role === role,
    hasAnyRole:
      (state: AuthState) =>
      (roles: string[]): boolean =>
        roles.includes(state.user.role || ""),

    isStudent: (state: AuthState): boolean => state.user.role === ROLES.STUDENT,
    isInstitutionMember: (state: AuthState): boolean =>
      state.user.role === ROLES.INSTITUTION_MEMBER,

    defaultRoute: (state: AuthState): RouteConfig | null => {
      if (!state.user.role || !state.user.institutionDomain) return null;

      const routeName: string =
        state.user.role === ROLES.STUDENT
          ? ROUTE_NAMES.STUDENT_HOME
          : ROUTE_NAMES.TEACHER_HOME;

      return {
        name: routeName,
        params: { institutionDomain: state.user.institutionDomain },
      };
    },

    institutionClaims: (state: AuthState): InstitutionClaims => ({
      institutionDomain: state.user.institutionDomain,
      institutionId: state.user.institutionId,
    }),
  },

  actions: {
    async login(
      credentials: LoginCredentials,
    ): Promise<Result<LoginSuccessData, string>> {
      const { username, password, rememberMe = false } = credentials;

      if (!username?.trim() || !password?.trim()) {
        return failure("Username and password are required");
      }

      const loginResult: Result<LoginResponse, string> =
        await authService.login(username, password);

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
        token: this.token!,
        message: "Login successful",
      });
    },

    async logout(): Promise<void> {
      await authService.logout();
      this._clearAuthState();
    },

    async logoutAll(): Promise<void> {
      await authService.logoutAll();
      this._clearAuthState();
    },

    async initializeAuth(): Promise<Result<boolean, string>> {
      if (this.isInitialized) return success(true);

      // Listen for token expiration events from API interceptor
      // window.addEventListener('auth:token-expired', this._clearAuthState);

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
          this._clearAuthState();
          return failure("Token is invalid, please log in again");
        }
      }

      this.isInitialized = true;
      return success(true);
    },

    async refreshTokens(): Promise<Result<boolean, string>> {
      const token = this.refreshToken || getRefreshToken();

      if (!token) return failure("No refresh token available");

      const refreshResult: Result<LoginResponse, string> =
        await authService.refreshToken(token);
      if (refreshResult.isFailure) {
        this._clearAuthState();
        return refreshResult;
      }

      const { accessToken, refreshToken } = refreshResult.data;
      const remembered = isTokenRemembered();
      return this._setTokens(accessToken, refreshToken, remembered);
    },

    _setTokens(
      accessToken: string | null,
      refreshToken: string | null,
      rememberMe: boolean = false,
    ): Result<boolean, string> {
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

    _handleFailedLogin(error: string): void {
      this.loginAttempts += 1;
      this.lastLoginError = error;
      this._clearAuthState();
    },

    _clearAuthState(): void {
      this.token = null;
      this.refreshToken = null;
      this.user = initialUser();
      this.lastLoginError = null;
      this.isInitialized = false;
      clearAllTokens();
    },
  },
});
