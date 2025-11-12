import { api } from "@/lib/api-client";

export interface TeacherClass {
  id: number;
  name: string;
  section?: string;
  studentCount: number;
  schedule?: string;
  room?: string;
  courseId?: number;
  sectionId?: number;
}

export interface TeacherClassesResponse {
  success: boolean;
  data: TeacherClass[];
  total?: number;
}

export const teacherClassesService = {
  // Get all classes for the current teacher
  async getMyClasses(): Promise<TeacherClass[]> {
    const response = await api.get<TeacherClassesResponse | TeacherClass[]>("/teachers/my-classes");
    if (Array.isArray(response)) {
      return response;
    }
    return (response as TeacherClassesResponse).data || [];
  },

  // Alternative: Get classes for a specific teacher by ID
  async getTeacherClasses(teacherId: number): Promise<TeacherClass[]> {
    const response = await api.get<TeacherClassesResponse | TeacherClass[]>(
      `/teachers/${teacherId}/classes`
    );
    if (Array.isArray(response)) {
      return response;
    }
    return (response as TeacherClassesResponse).data || [];
  },
};
