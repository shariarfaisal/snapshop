import { Program, Subject } from "@/types/program";

const API_URL = "/api/programs";

export const programService = {
  getAll: async (): Promise<Program[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch programs");
    return response.json();
  },

  getById: async (id: string): Promise<Program> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch program");
    return response.json();
  },

  create: async (data: Omit<Program, "id" | "createdAt" | "updatedAt">): Promise<Program> => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create program");
    return response.json();
  },

  update: async (id: string, data: Partial<Program>): Promise<Program> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update program");
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete program");
  },

  getSubjects: async (programId: string): Promise<Subject[]> => {
    const response = await fetch(`${API_URL}/${programId}/subjects`);
    if (!response.ok) throw new Error("Failed to fetch subjects");
    return response.json();
  },

  addSubject: async (programId: string, data: Omit<Subject, "id" | "programId" | "createdAt" | "updatedAt">): Promise<Subject> => {
    const response = await fetch(`${API_URL}/${programId}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to add subject");
    return response.json();
  },

  removeSubject: async (programId: string, subjectId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${programId}/subjects/${subjectId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to remove subject");
  },
}; 