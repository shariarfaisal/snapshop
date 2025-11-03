import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// Create axios instance with defaults
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: true, // Send cookies with requests
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getCookie("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response interceptor - handle token refresh & errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const config = error.config as InternalAxiosRequestConfig;

      // If 401 Unauthorized, try to refresh token
      if (error.response?.status === 401 && config && !config.headers["X-Retry"]) {
        try {
          const refreshToken = getCookie("refresh_token");
          if (!refreshToken) {
            // No refresh token, redirect to login
            if (typeof window !== "undefined") {
              deleteCookie("auth_token");
              window.location.href = "/auth/login";
            }
            return Promise.reject(error);
          }

          // Attempt refresh
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { token } = response.data;
          setCookie("auth_token", token);
          setCookie("refresh_token", response.data.refresh_token);

          // Retry original request
          config.headers.Authorization = `Bearer ${token}`;
          config.headers["X-Retry"] = "true";
          return client(config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          if (typeof window !== "undefined") {
            deleteCookie("auth_token");
            window.location.href = "/auth/login";
          }
          return Promise.reject(refreshError);
        }
      }

      // Handle 401 with redirect to login
      if (error.response?.status === 401) {
        if (typeof window !== "undefined" && window.location.pathname !== "/auth/login") {
          deleteCookie("auth_token");
          window.location.href = "/auth/login";
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Export public client (no auth required)
export const $clientPublic = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Export private client (auth required) - same as apiClient with raw axios interface
export const $clientPrivate = apiClient;

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/**
 * Type-safe API request helper
 */
export const api = {
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data.data;
  },

  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  patch: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  delete: async <T = void>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },
};
