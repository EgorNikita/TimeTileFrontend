import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL } from "@/constants";
import { getAuthToken, clearAllTokens } from "@/utils/tokenUtils";
import { authService } from "@/services/authService";
import {
  isResultPattern,
  failure,
  success,
  Result,
} from "@/utils/resultPattern";

interface ErrorMessages {
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

interface ResultError {
  message?: string;
  code?: string | number;
  details?: any;
}

interface ResultPatternResponse<T = any> {
  isSuccess: boolean;
  data?: T;
  error?: ResultError;
}

interface FriendlyError {
  type: "result" | "http" | "network" | "setup";
  message: string;
  code?: string | number;
  details?: any;
  status?: number;
  data?: any;
  resultError?: ResultError;
}

interface AuthRefreshResponse {
  AccessToken: string;
}

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const defaultMessages: ErrorMessages = {
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
};

function createAxiosInstance(messages: ErrorMessages): AxiosInstance {
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => handleSuccessResponse(response),
    (error: AxiosError) => handleErrorResponse(error, api, messages),
  );

  return api;
}

function handleSuccessResponse(
  response: AxiosResponse,
): AxiosResponse | Result<any> {
  const data = response.data;
  if (isResultPattern(data)) {
    if (data.isSuccess) {
      return success(data.data);
    }

    const friendlyError: FriendlyError = {
      type: "result",
      message: data.error?.message || "Operation failed",
      code: data.error?.code,
      details: data.error?.details,
    };

    return failure(friendlyError);
  }
  return response;
}

async function handleErrorResponse(
  error: AxiosError,
  api: AxiosInstance,
  messages: ErrorMessages,
): Promise<Result<any>> {
  const { response, request, code, message, config: originalRequest } = error;
  const extendedConfig = originalRequest as ExtendedAxiosRequestConfig;

  let friendlyError: FriendlyError;

  if (response?.status === 401 && !extendedConfig?._retry) {
    if (extendedConfig) {
      extendedConfig._retry = true;
    }

    try {
      const refreshResult = await authService.refreshToken();

      if (refreshResult.isSuccess && refreshResult.data) {
        const { AccessToken } = refreshResult.data as AuthRefreshResponse;
        if (extendedConfig?.headers) {
          extendedConfig.headers.Authorization = `Bearer ${AccessToken}`;
        }
        return api(extendedConfig);
      }
    } catch (refreshError) {
      clearAllTokens();
      // window.dispatchEvent(new CustomEvent('auth:token-expired'));
      return failure(error);
    }
  }

  if (response) {
    const status = response.status;
    let errorMessage = messages[status] || messages.default;
    let resultError: ResultError | null = null;

    if (response.data && isResultPattern(response.data)) {
      const resultData = response.data as ResultPatternResponse;
      resultError = resultData.error || null;
      errorMessage = resultError?.message || errorMessage;
    }

    friendlyError = {
      type: "http",
      status,
      message: errorMessage,
      data: response.data,
      resultError,
    };
  } else if (request) {
    friendlyError = {
      type: "network",
      message: messages.network,
    };
  } else {
    friendlyError = {
      type: "setup",
      code,
      message:
        code === "ECONNABORTED"
          ? messages.timeout
          : message || messages.default,
    };
  }

  return failure(friendlyError);
}

export function createApi(
  customMessages: Partial<ErrorMessages> = {},
): AxiosInstance {
  const messages: ErrorMessages = { ...defaultMessages, ...customMessages };
  return createAxiosInstance(messages);
}

export type {
  ErrorMessages,
  FriendlyError,
  ResultError,
  ResultPatternResponse,
};
