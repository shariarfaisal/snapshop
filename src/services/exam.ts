import { Exam, Grade, CreateExamInput, UpdateExamInput, UpdateGradeInput, GradeModerationInput } from "@/types/exam";

const API_URL = "/api/exams";

export const examService = {
  getAll: async (): Promise<Exam[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch exams");
    return response.json();
  },

  getById: async (id: string): Promise<Exam> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch exam");
    return response.json();
  },

  create: async (data: CreateExamInput): Promise<Exam> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create exam");
    return response.json();
  },

  update: async (id: string, data: UpdateExamInput): Promise<Exam> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update exam");
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete exam");
  },

  getGrades: async (examId: string): Promise<Grade[]> => {
    const response = await fetch(`${API_URL}/${examId}/grades`);
    if (!response.ok) throw new Error("Failed to fetch grades");
    return response.json();
  },

  updateGrades: async (examId: string, data: Record<string, UpdateGradeInput>): Promise<Grade[]> => {
    const response = await fetch(`${API_URL}/${examId}/grades`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update grades");
    return response.json();
  },

  moderateGrade: async (gradeId: string, data: GradeModerationInput): Promise<Grade> => {
    const response = await fetch(`/api/grades/${gradeId}/moderate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to moderate grade");
    return response.json();
  },

  finalizeGrade: async (gradeId: string): Promise<Grade> => {
    const response = await fetch(`/api/grades/${gradeId}/finalize`, {
      method: "PUT",
    });
    if (!response.ok) throw new Error("Failed to finalize grade");
    return response.json();
  },
}; 