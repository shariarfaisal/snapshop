import { ApplicationCreate, ApplicationUpdate } from '@/types/application';
import { Application } from '@/types/application';
import { $clientPrivate } from '@/lib/api-client';

export const admissionService = {
  async getAllApplications(params?: {
    page?: number;
    limit?: number;
    term?: string;
    level?: string;
    status?: string;
    merit_cat_id?: string;
  }) {
    const response = await $clientPrivate.get<{ data: Application[]; total: number }>('/v1/applications', { params });
    return response.data;
  },

  async getApplicationById(id: string) {
    const response = await $clientPrivate.get<Application>(`/v1/applications/${id}`);
    return response.data;
  },

  async createApplication(data: ApplicationCreate) {
    const response = await $clientPrivate.post<Application>('/v1/applications', data);
    return response.data;
  },

  async updateApplication(id: string, data: ApplicationUpdate) {
    const response = await $clientPrivate.patch<Application>(`/v1/applications/${id}`, data);
    return response.data;
  },

  async uploadApplicationDocument(id: string, file: File, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    const response = await $clientPrivate.post<Application>(`/v1/applications/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getApplicationDocuments(id: string) {
    const response = await $clientPrivate.get<Application['documents']>(`/v1/applications/${id}/documents`);
    return response.data;
  },
}; 