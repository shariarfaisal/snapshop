import { BASE_API_URL } from "@/constants";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

export const $clientPublic = axios.create({
  baseURL: BASE_API_URL,
});
$clientPublic.defaults.headers.common["Accept"] = "application/json";
$clientPublic.defaults.headers.common["X-Request-Source"] = "web";
$clientPublic.defaults.headers.common["x-app-id"] = process.env.NEXT_PUBLIC_APP_ID;

export const $clientPrivate = axios.create({
  baseURL: BASE_API_URL,
});
$clientPrivate.defaults.headers.common["Accept"] = "application/json";
$clientPrivate.defaults.headers.common["X-Request-Source"] = "web";
$clientPrivate.defaults.headers.common["x-app-id"] = process.env.NEXT_PUBLIC_APP_ID;

$clientPrivate.interceptors.request.use(
  async (config) => {
    const authToken = await getCookie("auth_token");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken.replace("Bearer ", "")}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$clientPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Check if we're already on the login page to prevent redirect loops
      if (typeof window !== 'undefined' && window.location.pathname !== "/auth/login") {
        await deleteCookie("auth_token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);
