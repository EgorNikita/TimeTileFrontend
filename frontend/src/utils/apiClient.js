import axios from "axios";
import { API_BASE_URL } from "@/constants.js";
import { getAuthToken, clearAllTokens } from "@/utils/tokenUtils.js";
import { authService } from "@/services/authService.js";
import { isResultPattern, failure, success } from "@/utils/resultPattern.js";

const defaultMessages = {
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

function createAxiosInstance(messages) {
  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => handleSuccessResponse(response),
    (error) => handleErrorResponse(error, api, messages),
  );

  return api;
}

function handleSuccessResponse(response) {
  const data = response.data;
  if (isResultPattern(data)) {
    if (data.isSuccess) return success(data.data);

    const friendlyError = {
      type: "result",
      message: data.error?.message || "Operation failed",
      code: data.error?.code,
      details: data.error?.details,
    };

    return failure(friendlyError);
  }
  return response;
}

async function handleErrorResponse(error, api, messages) {
  const { response, request, code, message, config: originalRequest } = error;

  let friendlyError = null;

  if (response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const refreshResult = await authService.refreshToken();

      if (refreshResult.isSuccess) {
        const { AccessToken } = refreshResult.data;
        originalRequest.headers.Authorization = `Bearer ${AccessToken}`;
        return api(originalRequest);
      }
    } catch (refreshError) {
      clearAllTokens();
      //window.dispatchEvent(new CustomEvent('auth:token-expired'));
      return failure(error);
    }
  }

  if (response) {
    const status = response.status;
    let errorMessage = messages[status] || messages.default;
    let resultError = null;

    if (response.data && isResultPattern(response.data)) {
      resultError = response.data.error;
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
      message: code === "ECONNABORTED" ? messages.timeout : message,
    };
  }

  return failure(friendlyError);
}

export function createApi(customMessages = {}) {
  const messages = { ...defaultMessages, ...customMessages };
  return createAxiosInstance(messages);
}
