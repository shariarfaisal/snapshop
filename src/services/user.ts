import { Paginated } from "@/types";
import { $clientPrivate } from "@/lib/api-client";
import { User, CreateUserInput, UpdateUserInput, ResetPasswordInput } from "@/types/user";

const BASE_URL = "/v1/users";

export const userService = {
  getAllUser: async (page = 1, limit = 15, filters: any = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await $clientPrivate.get<Paginated<User>>(`${BASE_URL}?${params}`);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await $clientPrivate.get<User>(`${BASE_URL}/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserInput) => {
    const response = await $clientPrivate.post<User>(BASE_URL, data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserInput) => {
    const response = await $clientPrivate.put<User>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await $clientPrivate.delete<void>(`${BASE_URL}/${id}`);
    return response.data;
  },

  resetUserPassword: async (id: string, data: ResetPasswordInput) => {
    const response = await $clientPrivate.put<void>(`${BASE_URL}/${id}/reset-password`, data);
    return response.data;
  },

  changeUserStatus: async (id: string, status: string) => {
    const response = await $clientPrivate.patch<User>(`${BASE_URL}/${id}/status`, { status });
    return response.data;
  },

  bulkCreateUsers: async (users: CreateUserInput[]) => {
    const response = await $clientPrivate.post<any>(`${BASE_URL}/bulk`, { users });
    return response.data;
  },

  deactivateUser: async (id: string) => {
    const response = await $clientPrivate.put<User>(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  },
}; 