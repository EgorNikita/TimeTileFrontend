import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/constants";
import { getAuthToken, clearAllTokens } from "@/utils/tokenUtils";
import { authService } from "@/services/authService";
import { isResultPattern, failure, success } from "@/utils/resultPattern";
import { ResultPattern } from "@/utils/resultPattern";

// ===== INTERFACES =====
export interface ErrorMessages {
  network: string;
  timeout: string;
  400: string;
  401: string;
  403: string;
  404: string;
  409: string;
  422: string;
  429: string;
  500: string;
  502: string;
  503: string;
  default: string;
  [key: string]: string;
}

export interface ResultError {
  message?: string;
  code?: string | number;
  details?: any;
}

export interface ResultPatternResponse<T = any> {
  isSuccess: boolean;
  data?: T;
  error?: ResultError;
}

export interface FriendlyError {
  type: "result" | "http" | "network" | "setup";
  message: string;
  code?: string | number;
  details?: any;
  status?: number;
  data?: any;
  resultError?: ResultError;
}

export interface AuthRefreshResponse {
  AccessToken: string;
}

export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export interface TypedAxiosInstance
  extends Omit<AxiosInstance, "get" | "post" | "put" | "delete" | "patch"> {
  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResultPattern<T>>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResultPattern<T>>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResultPattern<T>>;
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResultPattern<T>>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResultPattern<T>>;
}

// ===== CONSTANTS =====
const DEFAULT_MESSAGES: ErrorMessages = {
  network: "Network unreachable. Please check your internet connection.",
  timeout: "Request timed out. Please try again.",
  400: "Bad request. Please check your input.",
  401: "Unauthorized. Please log in again.",
  403: "Access denied. You don't have permission for this action.",
  404: "Resource not found.",
  409: "Conflict. The resource already exists or has been modified.",
  422: "Validation failed. Please check your input.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Server error. Please try again later.",
  502: "Service temporarily unavailable.",
  503: "Service unavailable. Please try again later.",
  default: "An unexpected error occurred.",
} as const;

const DEFAULT_CONFIG = {
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
} as const;

// ===== HELPER FUNCTIONS =====
function getErrorMessage(
  status: number,
  responseData: any,
  messages: ErrorMessages,
): { message: string; resultError: ResultError | null } {
  let errorMessage = messages[status] || messages.default;
  let resultError: ResultError | null = null;

  if (responseData && isResultPattern(responseData)) {
    const resultData = responseData as ResultPatternResponse;
    resultError = resultData.error || null;
    errorMessage = resultError?.message || errorMessage;
  }

  return { message: errorMessage, resultError };
}

function createFriendlyError(
  type: FriendlyError["type"],
  message: string,
  options: Partial<Omit<FriendlyError, "type" | "message">> = {},
): FriendlyError {
  return { type, message, ...options };
}

// ===== RESPONSE HANDLERS =====
function handleSuccessResponse(
  response: AxiosResponse,
): AxiosResponse | ResultPattern<any> {
  const data = response.data;

  if (!isResultPattern(data)) return response;

  if (data.isSuccess) {
    return success(data.data);
  }

  const friendlyError = createFriendlyError(
    "result",
    data.error?.message || "Operation failed",
    {
      code: data.error?.code,
      details: data.error?.details,
    },
  );

  return failure(friendlyError);
}

async function attemptTokenRefresh(
  config: ExtendedAxiosRequestConfig,
  api: AxiosInstance,
): Promise<ResultPattern<any> | null> {
  config._retry = true;

  try {
    const refreshResult = await authService.refreshToken();

    if (refreshResult.isSuccess && refreshResult.data) {
      const { AccessToken } = refreshResult.data as AuthRefreshResponse;
      if (config.headers) {
        config.headers.Authorization = `Bearer ${AccessToken}`;
      }
      return api(config);
    }
  } catch (refreshError) {
    clearAllTokens();
    console.warn("Token refresh failed:", refreshError);
  }

  return null;
}

function createFriendlyErrorFromAxiosError(
  error: AxiosError,
  messages: ErrorMessages,
): FriendlyError {
  const { response, request, code, message } = error;

  if (response) {
    const { message: errorMessage, resultError } = getErrorMessage(
      response.status,
      response.data,
      messages,
    );

    return createFriendlyError("http", errorMessage, {
      status: response.status,
      data: response.data,
      resultError,
    });
  }

  if (request) {
    return createFriendlyError("network", messages.network);
  }

  return createFriendlyError(
    "setup",
    code === "ECONNABORTED" ? messages.timeout : message || messages.default,
    { code },
  );
}

async function handleErrorResponse(
  error: AxiosError,
  api: AxiosInstance,
  messages: ErrorMessages,
): Promise<ResultPattern<any>> {
  const { response, config: originalRequest } = error;
  const extendedConfig = originalRequest as ExtendedAxiosRequestConfig;

  // Handle 401 errors with token refresh
  if (response?.status === 401 && extendedConfig && !extendedConfig._retry) {
    const refreshResult = await attemptTokenRefresh(extendedConfig, api);
    if (refreshResult) {
      return refreshResult;
    }
  }

  return failure(createFriendlyErrorFromAxiosError(error, messages));
}

// ===== MAIN FACTORY FUNCTION =====
function createAxiosInstance(
  messages: ErrorMessages,
  config: Partial<typeof DEFAULT_CONFIG> = {},
): TypedAxiosInstance {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const api = axios.create({
    baseURL: API_BASE_URL,
    ...finalConfig,
  });

  // Request interceptor
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  api.interceptors.response.use(handleSuccessResponse, (error: AxiosError) =>
    handleErrorResponse(error, api, messages),
  );

  return api as TypedAxiosInstance;
}

// ===== PUBLIC API =====
export function createApi(
  customMessages: Partial<ErrorMessages> = {},
  config?: Partial<typeof DEFAULT_CONFIG>,
): TypedAxiosInstance {
  const messages: ErrorMessages = { ...DEFAULT_MESSAGES, ...customMessages };
  return createAxiosInstance(messages, config);
}

// Create a default instance for convenience
export const defaultApi = createApi();

// ===== UTILITY FUNCTIONS =====
export function createApiWithTimeout(
  timeout: number,
  customMessages: Partial<ErrorMessages> = {},
): TypedAxiosInstance {
  return createApi(customMessages, { timeout });
}

export function isTypedAxiosInstance(
  instance: any,
): instance is TypedAxiosInstance {
  return (
    instance &&
    typeof instance.get === "function" &&
    typeof instance.post === "function"
  );
}
