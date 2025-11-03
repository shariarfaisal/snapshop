import { Paginated } from "@/types";
import { $clientPrivate } from "@/lib/api-client";
import { Campus, CreateCampusInput, UpdateCampusInput } from "@/types/campus";

const BASE_URL = "/v1/campuses";

export const campusService = {
  getAll: async () => {
    const response = await $clientPrivate.get<Paginated<Campus>>(BASE_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await $clientPrivate.get<Campus>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateCampusInput) => {
    const response = await $clientPrivate.post<Campus>(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateCampusInput) => {
    const response = await $clientPrivate.put<Campus>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await $clientPrivate.delete(`${BASE_URL}/${id}`);
  },
}; 