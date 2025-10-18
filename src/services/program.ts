import { Program, Subject, ProgramWithSubjects, CurriculumMapEntry } from "@/types/program";
import { $clientPrivate } from "./client";

const BASE_URL = "/v1/programmes";

export const programService = {
  getAllPrograms: async (): Promise<Program[]> => {
    const response = await $clientPrivate.get<{ data: Program[] }>(BASE_URL);
    return response.data.data;
  },

  getProgramById: async (id: string): Promise<Program> => {
    const response = await $clientPrivate.get<Program>(`${BASE_URL}/${id}`);
    return response.data;
  },

  createProgram: async (data: Omit<Program, "id" | "createdAt" | "updatedAt">): Promise<Program> => {
    const response = await $clientPrivate.post<Program>(BASE_URL, data);
    return response.data;
  },

  updateProgram: async (id: number, data: Partial<Program>): Promise<Program> => {
    const response = await $clientPrivate.put<Program>(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteProgram: async (id: number): Promise<void> => {
    await $clientPrivate.delete(`${BASE_URL}/${id}`);
  },

  getProgramSubjects: async (programId: number) => {
    const response = await $clientPrivate.get<CurriculumMapEntry[]>(`${BASE_URL}/${programId}/subjects`);
    return response.data
  },

  addProgramSubject: async ({program_id, ...data}: {
    program_id: number, 
    subject_id: number;
    year_no: number;
    term_no: number;
    mandatory: boolean;
    prerequisite_subject_id?: number;
  }): Promise<CurriculumMapEntry> => {
    const response = await $clientPrivate.post<CurriculumMapEntry>(`${BASE_URL}/${program_id}/subjects`, data);
    return response.data;
  },

  updateProgramSubject: async (program_id: number, subject_id: number, data: Partial<CurriculumMapEntry>): Promise<CurriculumMapEntry> => {
    const response = await $clientPrivate.put<CurriculumMapEntry>(`${BASE_URL}/${program_id}/subjects/${subject_id}`, data);
    return response.data;
  },

  removeProgramSubject: async (program_id: number, subject_id: number) => {
    await $clientPrivate.delete(`${BASE_URL}/${program_id}/subjects/${subject_id}`);
  },
}; 