import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/services/finance";
import type {
  CreateFeeHeadInput,
  UpdateFeeHeadInput,
  FeeHeadFilters,
  CreateFeeStructureInput,
  UpdateFeeStructureInput,
  FeeStructureFilters,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceFilters,
  BulkGenerateInvoicesInput,
  CreatePaymentInput,
  UpdatePaymentInput,
  PaymentFilters,
  RefundPaymentInput,
} from "@/types/finance";

// Fee Heads Hooks
export const useFeeHeads = (filters?: FeeHeadFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["fee-heads", filters, page],
    queryFn: () => financeService.getAllFeeHeads(filters, page),
  });
};

export const useFeeHead = (id: number | null) => {
  return useQuery({
    queryKey: ["fee-head", id],
    queryFn: () => financeService.getFeeHeadById(id!),
    enabled: !!id,
  });
};

export const useCreateFeeHead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeeHeadInput) => financeService.createFeeHead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-heads"] });
    },
  });
};

export const useUpdateFeeHead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeeHeadInput }) =>
      financeService.updateFeeHead(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fee-heads"] });
      queryClient.invalidateQueries({ queryKey: ["fee-head", variables.id] });
    },
  });
};

export const useDeleteFeeHead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => financeService.deleteFeeHead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-heads"] });
    },
    onError: (error: any) => {
      console.error("Delete failed:", error);
    },
  });
};

// Fee Structures Hooks
export const useFeeStructures = (filters?: FeeStructureFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["fee-structures", filters, page],
    queryFn: () => financeService.getAllFeeStructures(filters, page),
  });
};

export const useFeeStructure = (id: number | null) => {
  return useQuery({
    queryKey: ["fee-structure", id],
    queryFn: () => financeService.getFeeStructureById(id!),
    enabled: !!id,
  });
};

export const useCreateFeeStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeeStructureInput) => financeService.createFeeStructure(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-structures"] });
    },
  });
};

export const useUpdateFeeStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeeStructureInput }) =>
      financeService.updateFeeStructure(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fee-structures"] });
      queryClient.invalidateQueries({ queryKey: ["fee-structure", variables.id] });
    },
  });
};

export const useDeleteFeeStructure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => financeService.deleteFeeStructure(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fee-structures"] });
    },
  });
};

// Invoices Hooks
export const useInvoices = (filters?: InvoiceFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["invoices", filters, page],
    queryFn: () => financeService.getAllInvoices(filters, page),
  });
};

export const useInvoice = (id: number | null) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => financeService.getInvoiceById(id!),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceInput) => financeService.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateInvoiceInput }) =>
      financeService.updateInvoice(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => financeService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const useBulkGenerateInvoices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkGenerateInvoicesInput) => financeService.bulkGenerateInvoices(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const useCancelInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => financeService.cancelInvoice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const useInvoiceStatistics = () => {
  return useQuery({
    queryKey: ["invoice-statistics"],
    queryFn: () => financeService.getInvoiceStatistics(),
  });
};

// Payments Hooks
export const usePayments = (filters?: PaymentFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["payments", filters, page],
    queryFn: () => financeService.getAllPayments(filters, page),
  });
};

export const usePayment = (id: number | null) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => financeService.getPaymentById(id!),
    enabled: !!id,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentInput) => financeService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["payment-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePaymentInput }) =>
      financeService.updatePayment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["payment-statistics"] });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => financeService.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["payment-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RefundPaymentInput }) =>
      financeService.refundPayment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["payment-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });
};

export const usePaymentStatistics = (filters?: { from_date?: string; to_date?: string; payment_method?: string }) => {
  return useQuery({
    queryKey: ["payment-statistics", filters],
    queryFn: () => financeService.getPaymentStatistics(filters),
  });
};

// Student Finance Hooks
export const useStudentInvoices = (studentId: number | null, page: number = 1, perPage: number = 15) => {
  return useQuery({
    queryKey: ["student-invoices", studentId, page, perPage],
    queryFn: () => financeService.getStudentInvoices(studentId!, page, perPage),
    enabled: !!studentId,
  });
};

export const useStudentOutstandingDues = (studentId: number | null) => {
  return useQuery({
    queryKey: ["student-outstanding-dues", studentId],
    queryFn: () => financeService.getStudentOutstandingDues(studentId!),
    enabled: !!studentId,
  });
};
