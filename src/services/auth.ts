import { $clientPublic } from "./client";

export const AUTH_API = {
  async signup(payload: { name: string; email: string; password: string }) {
    const { data } = await $clientPublic.post("/auth/register", payload);
    return data;
  },
  async login(payload: { email: string; password: string }) {
    const { data } = await $clientPublic.post<{
      message: string;
      token: string;
    }>("/auth/login", payload);
    return data;
  },
};
