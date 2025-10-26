import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "cookies-next";

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
            window.location.href = "/login";
            return Promise.reject(error);
          }

          // Attempt refresh
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
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
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

/**
 * Type-safe API request helper
 */
export const api = {
  get: async <T>(url: string, config?: any) => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: any) => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data?: any, config?: any) => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: any, config?: any) => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: any) => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};
