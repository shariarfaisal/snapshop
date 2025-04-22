import { Admission, CreateAdmissionInput, UpdateAdmissionStatusInput } from "@/types/admission";

const API_URL = "/api/admissions";

export const admissionService = {
  getAll: async (): Promise<Admission[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch admissions");
    return response.json();
  },

  getById: async (id: string): Promise<Admission> => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch admission");
    return response.json();
  },

  create: async (data: CreateAdmissionInput): Promise<Admission> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "documents" && value) {
        (value as File[]).forEach((file) => formData.append("documents", file));
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to create admission");
    return response.json();
  },

  updateStatus: async (
    id: string,
    data: UpdateAdmissionStatusInput
  ): Promise<Admission> => {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update admission status");
    return response.json();
  },

  shortlist: async (id: string, notes?: string): Promise<Admission> => {
    return admissionService.updateStatus(id, { status: "Shortlisted", notes });
  },

  offer: async (id: string, notes?: string): Promise<Admission> => {
    return admissionService.updateStatus(id, { status: "Offered", notes });
  },

  reject: async (id: string, notes?: string): Promise<Admission> => {
    return admissionService.updateStatus(id, { status: "Rejected", notes });
  },

  accept: async (id: string, notes?: string): Promise<Admission> => {
    return admissionService.updateStatus(id, { status: "Accepted", notes });
  },

  sendOfferLetter: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}/send-offer`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to send offer letter");
  },
}; 