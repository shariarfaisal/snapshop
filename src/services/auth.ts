import { $clientPrivate, $clientPublic } from "./client";
import { User } from "@/types/user";

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const AUTH_API = {
  async signup(payload: { name: string; email: string; password: string }) {
    const { data } = await $clientPublic.post("/auth/register", payload);
    return data;
  },
  async login(payload: LoginPayload) {
    const { data } = await $clientPublic.post<LoginResponse>(
      "/auth/login",
      payload
    );
    return data;
  },
  getMe: async () => {
    const { data } = await $clientPrivate.get<User>("/me");
    return data;
  },
};
