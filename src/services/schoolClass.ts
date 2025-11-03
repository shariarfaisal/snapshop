import { $clientPrivate } from "@/lib/api-client";
import {
  SchoolClass,
  CreateSchoolClassInput,
  UpdateSchoolClassInput,
  SchoolClassFilters,
  SchoolClassResponse,
  SchoolClassesResponse,
  SchoolClassStatsResponse,
  BulkUpdateStatusInput,
} from "@/types/schoolClass";

const BASE_URL = "/school-classes";

export const schoolClassService = {
  /**
   * Get all school classes with filters and pagination
   */
  getAll: async (filters?: SchoolClassFilters): Promise<SchoolClassesResponse> => {
    const queryParams = new URLSearchParams();

    if (filters?.search) {
      queryParams.append("search", filters.search);
    }

    if (filters?.status !== undefined) {
      queryParams.append("status", filters.status.toString());
    }

    if (filters?.sortBy) {
      queryParams.append("sortBy", filters.sortBy);
    }

    if (filters?.sortOrder) {
      queryParams.append("sortOrder", filters.sortOrder);
    }

    if (filters?.perPage !== undefined) {
      queryParams.append("perPage", filters.perPage.toString());
    }

    if (filters?.page !== undefined) {
      queryParams.append("page", filters.page.toString());
    }

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<SchoolClassesResponse>(`${BASE_URL}${queryString}`);
    return response.data;
  },

  /**
   * Get a single school class by ID
   */
  getById: async (id: number): Promise<SchoolClassResponse> => {
    const response = await $clientPrivate.get<SchoolClassResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new school class
   */
  create: async (data: CreateSchoolClassInput): Promise<SchoolClassResponse> => {
    const response = await $clientPrivate.post<SchoolClassResponse>(BASE_URL, data);
    return response.data;
  },

  /**
   * Update an existing school class
   */
  update: async (id: number, data: UpdateSchoolClassInput): Promise<SchoolClassResponse> => {
    const response = await $clientPrivate.put<SchoolClassResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a school class
   */
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get school class statistics
   */
  getStats: async (id: number): Promise<SchoolClassStatsResponse> => {
    const response = await $clientPrivate.get<SchoolClassStatsResponse>(`${BASE_URL}/${id}/stats`);
    return response.data;
  },

  /**
   * Bulk update status for multiple school classes
   */
  bulkUpdateStatus: async (data: BulkUpdateStatusInput): Promise<{ success: boolean; message: string }> => {
    const response = await $clientPrivate.post<{ success: boolean; message: string }>(
      `${BASE_URL}/bulk/status`,
      data
    );
    return response.data;
  },
};
