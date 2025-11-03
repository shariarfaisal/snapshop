import { $clientPrivate } from "@/lib/api-client";
import type { Form, FormResponse } from "@/types/form";

export const formService = {
  getAllForms: async (params?: {
    role?: string;
    status?: string;
    search?: string;
  }) => {
    const response = await $clientPrivate.get<Form[]>("/forms", { params });
    return response.data;
  },

  getFormById: async (id: string) => {
    const response = await $clientPrivate.get<Form>(`/forms/${id}`);
    return response.data;
  },

  createForm: async (data: Omit<Form, "id" | "createdAt" | "createdBy">) => {
    const response = await $clientPrivate.post<Form>("/forms", data);
    return response.data;
  },

  updateForm: async (id: string, data: Partial<Form>) => {
    const response = await $clientPrivate.put<Form>(`/forms/${id}`, data);
    return response.data;
  },

  deleteForm: async (id: string) => {
    await $clientPrivate.delete(`/forms/${id}`);
  },

  getFormResponses: async (formId: string) => {
    const response = await $clientPrivate.get<FormResponse[]>(`/forms/${formId}/responses`);
    return response.data;
  },

  getFormResponseById: async (formId: string, responseId: string) => {
    const response = await $clientPrivate.get<FormResponse>(`/forms/${formId}/responses/${responseId}`);
    return response.data;
  },

  shareForm: async (formId: string, roles: string[]) => {
    const response = await $clientPrivate.post<Form>(`/forms/${formId}/share`, { roles });
    return response.data;
  },
}; 