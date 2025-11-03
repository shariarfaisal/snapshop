import { CourseOffering } from "@/types/course-offering";
import { $clientPrivate } from "@/lib/api-client";

const BASE_URL = "/v1/courses";

export const courseOfferingService = {
  getAll: async (filters?: { programId?: string; subjectId?: string; status?: string }): Promise<CourseOffering[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters?.programId) {
      queryParams.append("programId", filters.programId);
    }
    
    if (filters?.subjectId) {
      queryParams.append("subjectId", filters.subjectId);
    }
    
    if (filters?.status) {
      queryParams.append("status", filters.status);
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ data: CourseOffering[] }>(`${BASE_URL}${queryString}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<CourseOffering> => {
    const response = await $clientPrivate.get<CourseOffering>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: Omit<CourseOffering, "id" | "createdAt" | "updatedAt">): Promise<CourseOffering> => {
    const response = await $clientPrivate.post<CourseOffering>(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: Partial<CourseOffering>): Promise<CourseOffering> => {
    const response = await $clientPrivate.put<CourseOffering>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await $clientPrivate.delete(`${BASE_URL}/${id}`);
  },
  
  // Get course offerings by program
  getCourseOfferingsByProgram: async (programId: string): Promise<CourseOffering[]> => {
    const response = await $clientPrivate.get<{ data: CourseOffering[] }>(`${BASE_URL}?programId=${programId}`);
    return response.data.data;
  },
  
  // Get course offerings by subject
  getCourseOfferingsBySubject: async (subjectId: string): Promise<CourseOffering[]> => {
    const response = await $clientPrivate.get<{ data: CourseOffering[] }>(`${BASE_URL}?subjectId=${subjectId}`);
    return response.data.data;
  },
  
  // Get course offerings for a specific academic year and term
  getCourseOfferingsByTerm: async (academicYear: string, term: number): Promise<CourseOffering[]> => {
    const response = await $clientPrivate.get<{ data: CourseOffering[] }>(`${BASE_URL}?academicYear=${academicYear}&term=${term}`);
    return response.data.data;
  },
  
  // Get course offerings for a specific instructor
  getCourseOfferingsByInstructor: async (instructorId: string): Promise<CourseOffering[]> => {
    const response = await $clientPrivate.get<{ data: CourseOffering[] }>(`${BASE_URL}?instructorId=${instructorId}`);
    return response.data.data;
  },
}; 