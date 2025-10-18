import { Subject, CreateSubjectInput, UpdateSubjectInput } from "@/types/program";
import { $clientPrivate } from "./client";
import { UseSubjectProps } from "@/hooks/use-subject";

const BASE_URL = "/v1/subjects";

export const subjectService = {
  getAllSubjects: async (params?: UseSubjectProps) => {
    const response = await $clientPrivate.get<{ data: Subject[], total: number }>(
      `${BASE_URL}`, {
        params
      }
    );
    return response.data;
  },

  getSubjectById: async (id: string): Promise<Subject> => {
    const response = await $clientPrivate.get<Subject>(`${BASE_URL}/${id}`);
    return response.data;
  },

  createSubject: async (data: CreateSubjectInput): Promise<Subject> => {
    const response = await $clientPrivate.post<Subject>(BASE_URL, data);
    return response.data;
  },

  updateSubject: async (id: string, data: UpdateSubjectInput): Promise<Subject> => {
    const response = await $clientPrivate.put<Subject>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteSubject: async (id: string): Promise<void> => {
    await $clientPrivate.delete(`${BASE_URL}/${id}`);
  }
}; 