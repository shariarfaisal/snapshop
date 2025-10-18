import { Paginated } from "@/types";
import { $clientPrivate } from "./client";
import { 
  StudentProfile, 
  CreateStudentProfileInput, 
  UpdateStudentProfileInput,
  StudentMedical,
  CreateStudentMedicalInput,
  UpdateStudentMedicalInput,
  StudentGuardian,
  CreateStudentGuardianInput,
  UpdateStudentGuardianInput
} from "@/types/student";

const BASE_URL = "/v1/students";

export const studentService = {
  // Student profiles
  getAll: async (filters?: { campusId?: string; programId?: string; status?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.campusId) {
      queryParams.append("campusId", filters.campusId);
    }
    
    if (filters?.programId) {
      queryParams.append("programId", filters.programId);
    }
    
    if (filters?.status) {
      queryParams.append("status", filters.status);
    }
    
    if (filters?.search) {
      queryParams.append("search", filters.search);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<Paginated<StudentProfile>>(`${BASE_URL}${queryString}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await $clientPrivate.get<StudentProfile>(`${BASE_URL}/${id}`);
    return response.data;
  },

  getByUserId: async (userId: string) => {
    const response = await $clientPrivate.get<StudentProfile>(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  create: async (data: CreateStudentProfileInput) => {
    const response = await $clientPrivate.post<StudentProfile>(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateStudentProfileInput) => {
    const response = await $clientPrivate.put<StudentProfile>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await $clientPrivate.delete<void>(`${BASE_URL}/${id}`);
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