import { api } from "@/lib/api-client";
import {
  Exam,
  ExamSubject,
  Mark,
  GradeScale,
  CreateExamInput,
  UpdateExamInput,
  CreateExamSubjectInput,
  CreateMarkInput,
  BulkCreateMarksInput,
  CreateGradeScaleInput
} from "@/types/exam";

export const examService = {
  // Exams
  getAll: async (filters?: Record<string, any>): Promise<Exam[]> => {
    const params = filters ? { params: filters } : undefined;
    return api.get<Exam[]>("/exams", params);
  },

  getById: async (id: number): Promise<Exam> => {
    return api.get<Exam>(`/exams/${id}`);
  },

  create: async (data: CreateExamInput): Promise<Exam> => {
    return api.post<Exam>("/exams", data);
  },

  update: async (id: number, data: UpdateExamInput): Promise<Exam> => {
    return api.put<Exam>(`/exams/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/exams/${id}`);
  },

  getSubjects: async (examId: number): Promise<ExamSubject[]> => {
    return api.get<ExamSubject[]>(`/exams/${examId}/subjects`);
  },

  addSubject: async (examId: number, data: CreateExamSubjectInput): Promise<ExamSubject> => {
    return api.post<ExamSubject>(`/exams/${examId}/subjects`, data);
  },

  updateSubject: async (examId: number, subjectId: number, data: Partial<CreateExamSubjectInput>): Promise<ExamSubject> => {
    return api.put<ExamSubject>(`/exams/${examId}/subjects/${subjectId}`, data);
  },

  removeSubject: async (examId: number, subjectId: number): Promise<void> => {
    return api.delete<void>(`/exams/${examId}/subjects/${subjectId}`);
  },

  getSchedule: async (examId: number): Promise<ExamSubject[]> => {
    return api.get<ExamSubject[]>(`/exams/${examId}/schedule`);
  },

  publishResults: async (examId: number): Promise<Exam> => {
    return api.post<Exam>(`/exams/${examId}/publish-results`);
  },

  getResults: async (examId: number): Promise<any[]> => {
    return api.get<any[]>(`/exams/${examId}/results`);
  },
};

export const markService = {
  getAll: async (filters?: Record<string, any>): Promise<Mark[]> => {
    const params = filters ? { params: filters } : undefined;
    return api.get<Mark[]>("/marks", params);
  },

  getById: async (id: number): Promise<Mark> => {
    return api.get<Mark>(`/marks/${id}`);
  },

  create: async (data: CreateMarkInput): Promise<Mark> => {
    return api.post<Mark>("/marks", data);
  },

  bulkCreate: async (data: BulkCreateMarksInput): Promise<Mark[]> => {
    return api.post<Mark[]>("/marks/bulk", data);
  },

  update: async (id: number, data: Partial<CreateMarkInput>): Promise<Mark> => {
    return api.put<Mark>(`/marks/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/marks/${id}`);
  },

  byExam: async (examId: number): Promise<Mark[]> => {
    return api.get<Mark[]>(`/marks/exam/${examId}`);
  },

  byExamSubject: async (examId: number, subjectId: number): Promise<Mark[]> => {
    return api.get<Mark[]>(`/marks/exam/${examId}/subject/${subjectId}`);
  },

  studentExam: async (studentId: number, examId: number): Promise<Mark[]> => {
    return api.get<Mark[]>(`/marks/student/${studentId}/exam/${examId}`);
  },
};

export const gradeScaleService = {
  getAll: async (): Promise<GradeScale[]> => {
    return api.get<GradeScale[]>("/grade-scales");
  },

  getById: async (id: number): Promise<GradeScale> => {
    return api.get<GradeScale>(`/grade-scales/${id}`);
  },

  create: async (data: CreateGradeScaleInput): Promise<GradeScale> => {
    return api.post<GradeScale>("/grade-scales", data);
  },

  update: async (id: number, data: Partial<CreateGradeScaleInput>): Promise<GradeScale> => {
    return api.put<GradeScale>(`/grade-scales/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/grade-scales/${id}`);
  },
};
