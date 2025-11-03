import { 
  Subject, 
  CreateSubjectInput, 
  UpdateSubjectInput, 
  SubjectFilters,
  SubjectStatistics 
} from "@/types/subject";
import { $clientPrivate } from "@/lib/api-client";

const BASE_URL = "/subjects";

export interface SubjectResponse {
  success: boolean;
  data: Subject[];
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  total?: number;
  message: string;
}

export interface SingleSubjectResponse {
  success: boolean;
  data: Subject;
  message: string;
}

export interface StatisticsResponse {
  success: boolean;
  data: SubjectStatistics;
  message: string;
}

export const subjectService = {
  getAll: async (filters?: SubjectFilters): Promise<SubjectResponse> => {
    const response = await $clientPrivate.get<SubjectResponse>(BASE_URL, {
      params: filters
    });
    return response.data;
  },

  getById: async (id: number): Promise<SingleSubjectResponse> => {
    const response = await $clientPrivate.get<SingleSubjectResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateSubjectInput): Promise<SingleSubjectResponse> => {
    const response = await $clientPrivate.post<SingleSubjectResponse>(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSubjectInput): Promise<SingleSubjectResponse> => {
    const response = await $clientPrivate.put<SingleSubjectResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/${id}`);
    return response.data;
  },

  bulkDelete: async (ids: number[]): Promise<{ success: boolean; message: string; deleted: number; failed: number; errors: string[] }> => {
    const response = await $clientPrivate.post<{ success: boolean; message: string; deleted: number; failed: number; errors: string[] }>(`${BASE_URL}/bulk-delete`, { ids });
    return response.data;
  },

  getStatistics: async (): Promise<StatisticsResponse> => {
    const response = await $clientPrivate.get<StatisticsResponse>(`${BASE_URL}/statistics`);
    return response.data;
  }
}; 