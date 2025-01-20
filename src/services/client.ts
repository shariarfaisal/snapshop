import { BASE_API_URL } from "@/constants";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

export const $clientPublic = axios.create({
  baseURL: BASE_API_URL,
});
$clientPublic.defaults.headers.common["Accept"] = "application/json";
$clientPublic.defaults.headers.common["X-Request-Source"] = "web";

export const $clientPrivate = axios.create({
  baseURL: BASE_API_URL,
});
$clientPrivate.defaults.headers.common["Accept"] = "application/json";
$clientPrivate.defaults.headers.common["X-Request-Source"] = "web";

$clientPrivate.interceptors.request.use(
  async (config) => {
    const authToken = await getCookie("x-auth-token");
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken.replace(
        "Bearer ",
        ""
      )}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

$clientPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("x-auth-token");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
