import { Paginated } from "@/types";
import { $clientPrivate } from "./client";
import { 
  Student,
  StudentProfile, 
  CreateStudentInput,
  UpdateStudentInput,
  StudentFilters,
  StudentStatistics,
  CreateStudentProfileInput, 
  UpdateStudentProfileInput,
  StudentMedical,
  CreateStudentMedicalInput,
  UpdateStudentMedicalInput,
  StudentGuardian,
  CreateStudentGuardianInput,
  UpdateStudentGuardianInput
} from "@/types/student";

const BASE_URL = "/students";

export const studentService = {
  // Student CRUD operations
  getAll: async (filters?: StudentFilters, page: number = 1) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.class_id && filters.class_id !== "all") queryParams.append("class_id", filters.class_id.toString());
    if (filters?.section_id && filters.section_id !== "all") queryParams.append("section_id", filters.section_id.toString());
    if (filters?.academic_year_id && filters.academic_year_id !== "all") queryParams.append("academic_year_id", filters.academic_year_id.toString());
    if (filters?.status && filters.status !== "all") queryParams.append("status", filters.status);
    if (filters?.gender && filters.gender !== "all") queryParams.append("gender", filters.gender);
    if (filters?.blood_group && filters.blood_group !== "all") queryParams.append("blood_group", filters.blood_group);
    if (filters?.sort_by) queryParams.append("sort_by", filters.sort_by);
    if (filters?.sort_order) queryParams.append("sort_order", filters.sort_order);
    if (filters?.per_page) queryParams.append("per_page", filters.per_page.toString());
    
    queryParams.append("page", page.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ success: boolean; data: Paginated<Student>; message: string }>(`${BASE_URL}${queryString}`);
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await $clientPrivate.get<{ success: boolean; data: Student; message: string }>(`${BASE_URL}/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStudentInput) => {
    const response = await $clientPrivate.post<{ success: boolean; data: Student; message: string }>(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateStudentInput) => {
    const response = await $clientPrivate.put<{ success: boolean; data: Student; message: string }>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Bulk operations
  bulkUpdateStatus: async (studentIds: number[], status: string) => {
    const response = await $clientPrivate.post<{ success: boolean; data: { updated_count: number }; message: string }>(`${BASE_URL}/bulk-update-status`, {
      student_ids: studentIds,
      status,
    });
    return response.data;
  },

  bulkAssignClass: async (studentIds: number[], classId: number, sectionId?: number) => {
    const response = await $clientPrivate.post<{ success: boolean; data: { updated_count: number }; message: string }>(`${BASE_URL}/bulk-assign-class`, {
      student_ids: studentIds,
      class_id: classId,
      section_id: sectionId,
    });
    return response.data;
  },

  // Export
  export: async (filters?: StudentFilters) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.class_id && filters.class_id !== "all") queryParams.append("class_id", filters.class_id.toString());
    if (filters?.section_id && filters.section_id !== "all") queryParams.append("section_id", filters.section_id.toString());
    if (filters?.status && filters.status !== "all") queryParams.append("status", filters.status);
    
    const response = await $clientPrivate.post<{ success: boolean; data: any[]; message: string }>(`${BASE_URL}/export`, Object.fromEntries(queryParams));
    return response.data.data;
  },

  // Statistics
  getStatistics: async () => {
    const response = await $clientPrivate.get<{ success: boolean; data: StudentStatistics; message: string }>(`${BASE_URL}/statistics`);
    return response.data.data;
  },

  // Legacy compatibility
  getByUserId: async (userId: string) => {
    const response = await $clientPrivate.get<StudentProfile>(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  // Medical records
  getMedicalRecord: async (studentId: string) => {
    const response = await $clientPrivate.get<StudentMedical>(`${BASE_URL}/${studentId}/medical`);
    return response.data;
  },

  createMedicalRecord: async (data: CreateStudentMedicalInput) => {
    const response = await $clientPrivate.post<StudentMedical>(`${BASE_URL}/${data.studentId}/medical`, data);
    return response.data;
  },

  updateMedicalRecord: async (studentId: string, data: UpdateStudentMedicalInput) => {
    const response = await $clientPrivate.put<StudentMedical>(`${BASE_URL}/${studentId}/medical`, data);
    return response.data;
  },

  // Guardians
  getGuardians: async (studentId: string) => {
    const response = await $clientPrivate.get<StudentGuardian[]>(`${BASE_URL}/${studentId}/guardians`);
    return response.data;
  },

  addGuardian: async (data: CreateStudentGuardianInput) => {
    const response = await $clientPrivate.post<StudentGuardian>(`${BASE_URL}/${data.studentId}/guardians`, data);
    return response.data;
  },

  updateGuardian: async (guardianId: string, data: UpdateStudentGuardianInput) => {
    const response = await $clientPrivate.put<StudentGuardian>(`${BASE_URL}/guardians/${guardianId}`, data);
    return response.data;
  },

  deleteGuardian: async (guardianId: string) => {
    const response = await $clientPrivate.delete<void>(`${BASE_URL}/guardians/${guardianId}`);
    return response.data;
  },

  // Custom actions
  changeStatus: async (id: string, status: string) => {
    const response = await $clientPrivate.patch<StudentProfile>(`${BASE_URL}/${id}/status`, { status });
    return response.data;
  },
}; 