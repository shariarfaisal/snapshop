import { $clientPrivate, $clientPublic } from "./client";
import { User } from "@/types/user";

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginPayload {
  username: string;
  password: string;
}

export const AUTH_API = {
  async signup(payload: { name: string; email: string; password: string }) {
    const { data } = await $clientPublic.post("/register", payload);
    return data;
  },
  async login(payload: LoginPayload) {
    const { data } = await $clientPublic.post<LoginResponse>(
      "/v1/login",
      payload
    );
    return data;
  },
  getProfile: async () => {
    const { data } = await $clientPrivate.get<User>("/v1/me");
    return data;
  },
};
