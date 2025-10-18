import { Enrollment, EnrollmentStatus } from "@/types/course-offering";
import { $clientPrivate } from "./client";

const BASE_URL = "/v1/enrollments";

export const enrollmentService = {
  getAll: async (filters?: { courseOfferingId?: string; studentId?: string; status?: EnrollmentStatus }): Promise<Enrollment[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters?.courseOfferingId) {
      queryParams.append("courseOfferingId", filters.courseOfferingId);
    }
    
    if (filters?.studentId) {
      queryParams.append("studentId", filters.studentId);
    }
    
    if (filters?.status) {
      queryParams.append("status", filters.status);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ data: Enrollment[] }>(`${BASE_URL}${queryString}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Enrollment> => {
    const response = await $clientPrivate.get<Enrollment>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<Enrollment, "id" | "enrollmentDate" | "createdAt" | "updatedAt">): Promise<Enrollment> => {
    const response = await $clientPrivate.post<Enrollment>(BASE_URL, data);
    return response.data;
  },

  updateStatus: async (id: string, status: EnrollmentStatus): Promise<Enrollment> => {
    const response = await $clientPrivate.patch<Enrollment>(`${BASE_URL}/${id}/status`, { status });
    return response.data;
  },
  
  updateGrade: async (id: string, grade: number, feedback?: string): Promise<Enrollment> => {
    const response = await $clientPrivate.patch<Enrollment>(`${BASE_URL}/${id}/grade`, { grade, feedback });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await $clientPrivate.delete(`${BASE_URL}/${id}`);
  },
  
  // Get enrollments by course offering
  getEnrollmentsByCourseOffering: async (courseOfferingId: string): Promise<Enrollment[]> => {
    const response = await $clientPrivate.get<{ data: Enrollment[] }>(`${BASE_URL}?courseOfferingId=${courseOfferingId}`);
    return response.data.data;
  },
  
  // Get enrollments for a student
  getEnrollmentsByStudent: async (studentId: string): Promise<Enrollment[]> => {
    const response = await $clientPrivate.get<{ data: Enrollment[] }>(`${BASE_URL}?studentId=${studentId}`);
    return response.data.data;
  },
  
  // Batch approve enrollments
  batchApproveEnrollments: async (ids: string[]): Promise<void> => {
    await $clientPrivate.post<void>(`${BASE_URL}/batch-approve`, { ids });
  },
  
  // Batch reject enrollments
  batchRejectEnrollments: async (ids: string[]): Promise<void> => {
    await $clientPrivate.post<void>(`${BASE_URL}/batch-reject`, { ids });
  },
}; 