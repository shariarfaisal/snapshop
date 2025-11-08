import { Paginated } from "@/types";
import { $clientPrivate } from "@/lib/api-client";
import {
  FeeHead,
  CreateFeeHeadInput,
  UpdateFeeHeadInput,
  FeeHeadFilters,
  FeeStructure,
  CreateFeeStructureInput,
  UpdateFeeStructureInput,
  FeeStructureFilters,
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceFilters,
  BulkGenerateInvoicesInput,
  InvoiceStatistics,
  Payment,
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentFilters,
  RefundPaymentInput,
  PaymentStatistics,
} from "@/types/finance";

const BASE_URL = "";

export const financeService = {
  // Fee Heads
  getAllFeeHeads: async (filters?: FeeHeadFilters, page: number = 1) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.is_active !== undefined) queryParams.append("is_active", filters.is_active.toString());
    if (filters?.per_page) queryParams.append("per_page", filters.per_page.toString());
    
    queryParams.append("page", page.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ success: boolean; data: Paginated<FeeHead>; message: string }>(`${BASE_URL}/fee-heads${queryString}`);
    return response.data.data;
  },

  getFeeHeadById: async (id: number) => {
    const response = await $clientPrivate.get<{ success: boolean; data: FeeHead; message: string }>(`${BASE_URL}/fee-heads/${id}`);
    return response.data.data;
  },

  createFeeHead: async (data: CreateFeeHeadInput) => {
    const response = await $clientPrivate.post<{ success: boolean; data: FeeHead; message: string }>(`${BASE_URL}/fee-heads`, data);
    return response.data.data;
  },

  updateFeeHead: async (id: number, data: UpdateFeeHeadInput) => {
    const response = await $clientPrivate.put<{ success: boolean; data: FeeHead; message: string }>(`${BASE_URL}/fee-heads/${id}`, data);
    return response.data.data;
  },

  deleteFeeHead: async (id: number) => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/fee-heads/${id}`);
    return response.data;
  },

  // Fee Structures
  getAllFeeStructures: async (filters?: FeeStructureFilters, page: number = 1) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.class_id && filters.class_id !== "all") queryParams.append("class_id", filters.class_id.toString());
    if (filters?.academic_year_id && filters.academic_year_id !== "all") queryParams.append("academic_year_id", filters.academic_year_id.toString());
    if (filters?.frequency) queryParams.append("frequency", filters.frequency);
    if (filters?.per_page) queryParams.append("per_page", filters.per_page.toString());
    
    queryParams.append("page", page.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ success: boolean; data: Paginated<FeeStructure>; message: string }>(`${BASE_URL}/fee-structures${queryString}`);
    return response.data.data;
  },

  getFeeStructureById: async (id: number) => {
    const response = await $clientPrivate.get<{ success: boolean; data: FeeStructure; message: string }>(`${BASE_URL}/fee-structures/${id}`);
    return response.data.data;
  },

  createFeeStructure: async (data: CreateFeeStructureInput) => {
    const response = await $clientPrivate.post<{ success: boolean; data: FeeStructure; message: string }>(`${BASE_URL}/fee-structures`, data);
    return response.data.data;
  },

  updateFeeStructure: async (id: number, data: UpdateFeeStructureInput) => {
    const response = await $clientPrivate.put<{ success: boolean; data: FeeStructure; message: string }>(`${BASE_URL}/fee-structures/${id}`, data);
    return response.data.data;
  },

  deleteFeeStructure: async (id: number) => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/fee-structures/${id}`);
    return response.data;
  },

  // Invoices
  getAllInvoices: async (filters?: InvoiceFilters, page: number = 1) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.student_id && filters.student_id !== "all") queryParams.append("student_id", filters.student_id.toString());
    if (filters?.status && filters.status !== "all") queryParams.append("status", filters.status);
    if (filters?.from_date) queryParams.append("from_date", filters.from_date);
    if (filters?.to_date) queryParams.append("to_date", filters.to_date);
    if (filters?.overdue) queryParams.append("overdue", filters.overdue.toString());
    if (filters?.per_page) queryParams.append("per_page", filters.per_page.toString());
    
    queryParams.append("page", page.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ success: boolean; data: Paginated<Invoice>; message: string }>(`${BASE_URL}/invoices${queryString}`);
    return response.data.data;
  },

  getInvoiceById: async (id: number) => {
    const response = await $clientPrivate.get<{ success: boolean; data: Invoice; message: string }>(`${BASE_URL}/invoices/${id}`);
    return response.data.data;
  },

  createInvoice: async (data: CreateInvoiceInput) => {
    const response = await $clientPrivate.post<{ success: boolean; data: Invoice; message: string }>(`${BASE_URL}/invoices`, data);
    return response.data.data;
  },

  updateInvoice: async (id: number, data: UpdateInvoiceInput) => {
    const response = await $clientPrivate.put<{ success: boolean; data: Invoice; message: string }>(`${BASE_URL}/invoices/${id}`, data);
    return response.data.data;
  },

  deleteInvoice: async (id: number) => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/invoices/${id}`);
    return response.data;
  },

  bulkGenerateInvoices: async (data: BulkGenerateInvoicesInput) => {
    const response = await $clientPrivate.post<{ success: boolean; data: Invoice[]; message: string }>(`${BASE_URL}/invoices/bulk-generate`, data);
    return response.data.data;
  },

  cancelInvoice: async (id: number) => {
    const response = await $clientPrivate.post<{ success: boolean; data: Invoice; message: string }>(`${BASE_URL}/invoices/${id}/cancel`);
    return response.data.data;
  },

  getInvoiceStatistics: async () => {
    const response = await $clientPrivate.get<{ success: boolean; data: InvoiceStatistics; message: string }>(`${BASE_URL}/invoices-statistics`);
    return response.data.data;
  },

  // Payments
  getAllPayments: async (filters?: PaymentFilters, page: number = 1) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.student_id && filters.student_id !== "all") queryParams.append("student_id", filters.student_id.toString());
    if (filters?.invoice_id) queryParams.append("invoice_id", filters.invoice_id.toString());
    if (filters?.payment_method && filters.payment_method !== "all") queryParams.append("payment_method", filters.payment_method);
    if (filters?.status && filters.status !== "all") queryParams.append("status", filters.status);
    if (filters?.from_date) queryParams.append("from_date", filters.from_date);
    if (filters?.to_date) queryParams.append("to_date", filters.to_date);
    if (filters?.per_page) queryParams.append("per_page", filters.per_page.toString());
    
    queryParams.append("page", page.toString());
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ success: boolean; data: Paginated<Payment>; message: string }>(`${BASE_URL}/payments${queryString}`);
    return response.data.data;
  },

  getPaymentById: async (id: number) => {
    const response = await $clientPrivate.get<{ success: boolean; data: Payment; message: string }>(`${BASE_URL}/payments/${id}`);
    return response.data.data;
  },

  createPayment: async (data: CreatePaymentInput) => {
    const response = await $clientPrivate.post<{ success: boolean; data: Payment; message: string }>(`${BASE_URL}/payments`, data);
    return response.data.data;
  },

  updatePayment: async (id: number, data: UpdatePaymentInput) => {
    const response = await $clientPrivate.put<{ success: boolean; data: Payment; message: string }>(`${BASE_URL}/payments/${id}`, data);
    return response.data.data;
  },

  deletePayment: async (id: number) => {
    const response = await $clientPrivate.delete<{ success: boolean; message: string }>(`${BASE_URL}/payments/${id}`);
    return response.data;
  },

  refundPayment: async (id: number, data: RefundPaymentInput) => {
    const response = await $clientPrivate.post<{ success: boolean; data: Payment; message: string }>(`${BASE_URL}/payments/${id}/refund`, data);
    return response.data.data;
  },

  getPaymentStatistics: async (filters?: { from_date?: string; to_date?: string; payment_method?: string }) => {
    const queryParams = new URLSearchParams();

    if (filters?.from_date) queryParams.append("from_date", filters.from_date);
    if (filters?.to_date) queryParams.append("to_date", filters.to_date);
    if (filters?.payment_method) queryParams.append("payment_method", filters.payment_method);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    const response = await $clientPrivate.get<{ success: boolean; data: PaymentStatistics; message: string }>(`${BASE_URL}/payments-statistics${queryString}`);
    return response.data.data;
  },

  // Student Finance APIs
  getStudentInvoices: async (studentId: number) => {
    const response = await $clientPrivate.get<{ success: boolean; data: Invoice[]; message: string }>(`${BASE_URL}/students/${studentId}/invoices`);
    return response.data.data;
  },

  getStudentOutstandingDues: async (studentId: number) => {
    const response = await $clientPrivate.get<{
      success: boolean;
      data: {
        total_due: number;
        total_overdue: number;
        overdue_count: number;
        pending_invoices: number;
        invoices: Invoice[];
      };
      message: string
    }>(`${BASE_URL}/students/${studentId}/outstanding-dues`);
    return response.data.data;
  },
}; 