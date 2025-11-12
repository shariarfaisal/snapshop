import { api } from "@/lib/api-client";

export interface Mark {
  id: number;
  studentId: number;
  student?: {
    id: number;
    user: {
      firstName: string;
      lastName: string;
    };
  };
  examId: number;
  classId: number;
  subjectId?: number;
  marks: number;
  grade?: string;
  gradePoints?: number;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarksFilters {
  examId?: number;
  classId?: number;
  subjectId?: number;
  page?: number;
  per_page?: number;
}

export interface MarksListResponse {
  success: boolean;
  data: Mark[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  total?: number;
  current_page?: number;
  last_page?: number;
  per_page?: number;
}

export interface Exam {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  termId?: number;
  totalMarks?: number;
  passingMarks?: number;
}

export interface Subject {
  id: number;
  name: string;
  code?: string;
  description?: string;
}

export const teacherMarksService = {
  // Get marks with filters
  async getMarks(filters?: MarksFilters): Promise<MarksListResponse> {
    const params = new URLSearchParams();
    if (filters?.examId) params.append("exam_id", filters.examId.toString());
    if (filters?.classId) params.append("class_id", filters.classId.toString());
    if (filters?.subjectId) params.append("subject_id", filters.subjectId.toString());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.per_page) params.append("per_page", filters.per_page.toString());

    const url = params.toString() ? `/marks?${params.toString()}` : "/marks";
    const response = await api.get<MarksListResponse>(url);
    return response;
  },

  // Get available exams for teacher
  async getExams(): Promise<Exam[]> {
    const response = await api.get<any>("/exams");
    return (Array.isArray(response) ? response : response.data) || [];
  },

  // Get subjects
  async getSubjects(): Promise<Subject[]> {
    const response = await api.get<any>("/subjects");
    return (Array.isArray(response) ? response : response.data) || [];
  },

  // Create/Update mark
  async saveMark(data: {
    exam_id: number;
    student_id: number;
    class_id: number;
    subject_id?: number;
    marks: number;
    grade?: string;
    remarks?: string;
  }): Promise<Mark> {
    return api.post("/marks", data);
  },

  // Update single mark
  async updateMark(id: number, data: any): Promise<Mark> {
    return api.put(`/marks/${id}`, data);
  },

  // Bulk import marks
  async bulkImportMarks(file: File, examId: number): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("exam_id", examId.toString());

    return api.post("/marks/bulk-import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete mark
  async deleteMark(id: number): Promise<void> {
    return api.delete(`/marks/${id}`);
  },
};
