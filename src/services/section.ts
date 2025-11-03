import { $clientPrivate } from "@/lib/api-client";
import {
  Section,
  CreateSectionInput,
  UpdateSectionInput,
  SectionFilters,
  SectionResponse,
  SectionsResponse,
  SectionStatsResponse,
} from "@/types/section";

const BASE_URL = "/sections";

export const sectionService = {
  /**
   * Get all sections with filters and pagination
   */
  getAll: async (filters?: SectionFilters): Promise<SectionsResponse> => {
    const queryParams = new URLSearchParams();

    if (filters?.search) {
      queryParams.append("search", filters.search);
    }

    if (filters?.schoolClassId !== undefined) {
      queryParams.append("schoolClassId", filters.schoolClassId.toString());
    }

    if (filters?.status !== undefined) {
      queryParams.append("status", filters.status.toString());
    }

    if (filters?.minCapacity !== undefined) {
      queryParams.append("minCapacity", filters.minCapacity.toString());
    }

    if (filters?.maxCapacity !== undefined) {
      queryParams.append("maxCapacity", filters.maxCapacity.toString());
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
    const response = await $clientPrivate.get<SectionsResponse>(`${BASE_URL}${queryString}`);
    return response.data;
  },

  /**
   * Get a single section by ID
   */
  getById: async (id: number): Promise<SectionResponse> => {
    const response = await $clientPrivate.get<SectionResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get sections by school class ID
   */
  getBySchoolClass: async (schoolClassId: number): Promise<SectionResponse> => {
    const response = await $clientPrivate.get<SectionResponse>(`${BASE_URL}/class/${schoolClassId}`);
    return response.data;
  },

  /**
   * Create a new section
   */
  create: async (data: CreateSectionInput): Promise<SectionResponse> => {
    const response = await $clientPrivate.post<SectionResponse>(BASE_URL, data);
    return response.data;
  },

  /**
   * Update an existing section
   */
  update: async (id: number, data: UpdateSectionInput): Promise<SectionResponse> => {
    const response = await $clientPrivate.put<SectionResponse>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  /**
   * Delete a section
   */
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Get section statistics
   */
  getStats: async (id: number): Promise<SectionStatsResponse> => {
    const response = await $clientPrivate.get<SectionStatsResponse>(`${BASE_URL}/${id}/stats`);
    return response.data;
  },
};
