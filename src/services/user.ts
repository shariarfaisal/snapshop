import { Paginated } from "@/types";
import { $clientPrivate } from "./client";
import { User, CreateUserInput, UpdateUserInput, ResetPasswordInput } from "@/types/user";

const BASE_URL = "/v1/users";

export const userService = {
  getAll: async () => {
    const response = await $clientPrivate.get<Paginated<User>>(BASE_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await $clientPrivate.get<User>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateUserInput) => {
    const response = await $clientPrivate.post<User>(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserInput) => {
    const response = await $clientPrivate.put<User>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await $clientPrivate.delete<void>(`${BASE_URL}/${id}`);
    return response.data;
  },

  resetPassword: async (id: string, data: ResetPasswordInput) => {
    const response = await $clientPrivate.put<void>(`${BASE_URL}/${id}/reset-password`, data);
    return response.data;
  },

  deactivate: async (id: string) => {
    const response = await $clientPrivate.put<User>(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  },
}; 