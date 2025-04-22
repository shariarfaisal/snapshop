import { $clientPrivate } from "./client";
import {
  CreateFeePlanInput,
  CreatePaymentInput,
  CreateScholarshipAwardInput,
  FeePlan,
  Invoice,
  Payment,
  ScholarshipAward,
  UpdateFeePlanInput,
} from "@/types/finance";

export const financeService = {
  // Fee Plans
  getAllFeePlans: async () => {
    const response = await $clientPrivate.get<FeePlan[]>("/finance/fee-plans");
    return response.data;
  },

  getFeePlanById: async (id: string) => {
    const response = await $clientPrivate.get<FeePlan>(`/finance/fee-plans/${id}`);
    return response.data;
  },

  createFeePlan: async (data: CreateFeePlanInput) => {
    const response = await $clientPrivate.post<FeePlan>("/finance/fee-plans", data);
    return response.data;
  },

  updateFeePlan: async (id: string, data: UpdateFeePlanInput) => {
    const response = await $clientPrivate.patch<FeePlan>(`/finance/fee-plans/${id}`, data);
    return response.data;
  },

  deleteFeePlan: async (id: string) => {
    await $clientPrivate.delete(`/finance/fee-plans/${id}`);
  },

  // Invoices
  getAllInvoices: async (params?: {
    programId?: string;
    campusId?: string;
    termId?: string;
    status?: string;
  }) => {
    const response = await $clientPrivate.get<Invoice[]>("/finance/invoices", { params });
    return response.data;
  },

  getInvoiceById: async (id: string) => {
    const response = await $clientPrivate.get<Invoice>(`/finance/invoices/${id}`);
    return response.data;
  },

  // Payments
  createPayment: async (invoiceId: string, data: CreatePaymentInput) => {
    const response = await $clientPrivate.post<Payment>(
      `/finance/invoices/${invoiceId}/payments`,
      data
    );
    return response.data;
  },

  // Scholarships
  getAllScholarships: async () => {
    const response = await $clientPrivate.get<ScholarshipAward[]>("/finance/scholarships");
    return response.data;
  },

  createScholarship: async (data: CreateScholarshipAwardInput) => {
    const response = await $clientPrivate.post<ScholarshipAward>("/finance/scholarships", data);
    return response.data;
  },

  deleteScholarship: async (id: string) => {
    await $clientPrivate.delete(`/finance/scholarships/${id}`);
  },
}; 