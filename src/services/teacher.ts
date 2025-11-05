import { api } from "@/lib/api-client";
import type {
  Teacher,
  TeacherFormData,
  TeacherFilters,
  TeacherListResponse,
  Department,
  Designation,
} from "@/types/teacher";

const TEACHERS_ENDPOINT = "/teachers";
const DEPARTMENTS_ENDPOINT = "/departments";
const DESIGNATIONS_ENDPOINT = "/designations";

export const teacherService = {
  // Get all teachers with filters and pagination
  async getAll(filters?: TeacherFilters, page: number = 1): Promise<TeacherListResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    
    if (filters?.search) params.append("search", filters.search);
    if (filters?.department_id) params.append("department_id", filters.department_id.toString());
    if (filters?.designation_id) params.append("designation_id", filters.designation_id.toString());
    if (filters?.status) params.append("status", filters.status);
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());

    return api.get<TeacherListResponse>(
      `${TEACHERS_ENDPOINT}?${params.toString()}`
    );
  },

  // Get teachers (legacy method)
  async getTeachers(filters?: TeacherFilters): Promise<TeacherListResponse> {
    return this.getAll(filters);
  },

  // Get single teacher
  async getById(id: number): Promise<Teacher> {
    return api.get<Teacher>(`${TEACHERS_ENDPOINT}/${id}`);
  },

  // Get single teacher (legacy method)
  async getTeacher(id: number): Promise<Teacher> {
    return this.getById(id);
  },

  // Get available users for teacher assignment
  async getAvailableUsers(search?: string): Promise<any[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    
    const response = await api.get<any>(
      `${TEACHERS_ENDPOINT}/available/users?${params.toString()}`
    );
    return response.data || [];
  },

  // Create teacher
  async create(data: any): Promise<Teacher> {
    return api.post<Teacher>(TEACHERS_ENDPOINT, data);
  },

  // Create teacher (legacy method)
  async createTeacher(data: TeacherFormData): Promise<Teacher> {
    return this.create(data);
  },

  // Update teacher
  async update(id: number, data: any): Promise<Teacher> {
    return api.put<Teacher>(`${TEACHERS_ENDPOINT}/${id}`, data);
  },

  // Update teacher (legacy method)
  async updateTeacher(id: number, data: Partial<TeacherFormData>): Promise<Teacher> {
    return this.update(id, data);
  },

  // Delete teacher
  async delete(id: number): Promise<void> {
    return api.delete<void>(`${TEACHERS_ENDPOINT}/${id}`);
  },

  // Delete teacher (legacy method)
  async deleteTeacher(id: number): Promise<void> {
    return this.delete(id);
  },

  // Get teacher classes
  async getClasses(id: number): Promise<any[]> {
    const response = await api.get<any>(`${TEACHERS_ENDPOINT}/${id}/classes`);
    return response.data || [];
  },

  // Get teacher classes (legacy method)
  async getTeacherClasses(id: number): Promise<any[]> {
    return this.getClasses(id);
  },

  // Get teacher subjects
  async getSubjects(id: number): Promise<any[]> {
    const response = await api.get<any>(`${TEACHERS_ENDPOINT}/${id}/subjects`);
    return response.data || [];
  },

  // Get teacher subjects (legacy method)
  async getTeacherSubjects(id: number): Promise<any[]> {
    return this.getSubjects(id);
  },

  // Get teacher timetable
  async getTeacherTimetable(id: number): Promise<any[]> {
    const response = await api.get<any>(`${TEACHERS_ENDPOINT}/${id}/timetable`);
    return response.data || [];
  },

  // Get teacher lesson plans
  async getTeacherLessonPlans(id: number): Promise<any[]> {
    const response = await api.get<any>(`${TEACHERS_ENDPOINT}/${id}/lesson-plans`);
    return response.data || [];
  },

  // Get departments
  async getDepartments(filters?: { status?: string; per_page?: string }): Promise<Department[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append("status", filters.status);
    if (filters?.per_page) params.append("per_page", filters.per_page);

    const url = filters && Object.keys(filters).length > 0
      ? `${DEPARTMENTS_ENDPOINT}?${params.toString()}`
      : DEPARTMENTS_ENDPOINT;
    
    const response = await api.get<any>(url);
    // Handle both paginated and non-paginated responses
    return Array.isArray(response) ? response : response.data || response;
  },

  // Get designations
  async getDesignations(filters?: { 
    status?: string; 
    department_id?: number;
    per_page?: string;
  }): Promise<Designation[]> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append("status", filters.status);
    if (filters?.department_id) params.append("department_id", filters.department_id.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page);

    const url = filters && Object.keys(filters).length > 0
      ? `${DESIGNATIONS_ENDPOINT}?${params.toString()}`
      : DESIGNATIONS_ENDPOINT;
    
    const response = await api.get<any>(url);
    // Handle both paginated and non-paginated responses
    return Array.isArray(response) ? response : response.data || response;
  },

  // Export teachers (CSV/Excel)
  async exportTeachers(filters?: TeacherFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append("search", filters.search);
    if (filters?.department_id) params.append("department_id", filters.department_id.toString());
    if (filters?.designation_id) params.append("designation_id", filters.designation_id.toString());
    if (filters?.status) params.append("status", filters.status);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${TEACHERS_ENDPOINT}/export?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${document.cookie.split("auth_token=")[1]?.split(";")[0]}`,
        },
      }
    );

    return response.blob();
  },

  // Bulk import teachers
  async bulkImportTeachers(file: File): Promise<{ success: number; failed: number; errors: any[] }> {
    const formData = new FormData();
    formData.append("file", file);

    return api.post<{ success: number; failed: number; errors: any[] }>(
      `${TEACHERS_ENDPOINT}/bulk-import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
