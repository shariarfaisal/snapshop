import { api } from "@/lib/api-client";

export interface AcademicYear {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAcademicYearRequest {
  name: string;
  start_date: string;
  end_date: string;
  is_current?: boolean;
}

export interface UpdateAcademicYearRequest {
  name?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
}

export const academicYearService = {
  /**
   * Get all academic years
   */
  getAll: async (params?: { status?: 'active' | 'inactive' }): Promise<AcademicYear[]> => {
    return api.get<AcademicYear[]>("/academic-years", { params });
  },

  /**
   * Get academic year by ID
   */
  getById: async (id: string): Promise<AcademicYear> => {
    return api.get<AcademicYear>(`/academic-years/${id}`);
  },

  /**
   * Get current academic year
   */
  getCurrent: async (): Promise<AcademicYear> => {
    return api.get<AcademicYear>("/academic-years-current");
  },

  /**
   * Create new academic year
   */
  create: async (data: CreateAcademicYearRequest): Promise<AcademicYear> => {
    return api.post<AcademicYear>("/academic-years", data);
  },

  /**
   * Update academic year
   */
  update: async (id: string, data: UpdateAcademicYearRequest): Promise<AcademicYear> => {
    return api.put<AcademicYear>(`/academic-years/${id}`, data);
  },

  /**
   * Delete academic year
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/academic-years/${id}`);
  },

  /**
   * Set academic year as current
   */
  setCurrent: async (id: string): Promise<AcademicYear> => {
    return api.post<AcademicYear>(`/academic-years/${id}/set-current`);
  },
};
