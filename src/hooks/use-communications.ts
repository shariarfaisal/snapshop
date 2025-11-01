import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communicationsService } from "@/services/communications";
import type {
  CreateMessageInput,
  CreateMessageTemplateInput,
  CreateNoticeInput,
  UpdateMessageTemplateInput,
  UpdateNoticeInput,
  BulkMessageInput,
  MessageFilters,
  NoticeFilters,
  TemplateFilters,
} from "@/types/communications";

// ============= MESSAGE TEMPLATES =============
export const useMessageTemplates = (filters?: TemplateFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["message-templates", filters, page],
    queryFn: () => communicationsService.getAllTemplates(filters, page),
  });
};

export const useMessageTemplate = (id: number | null) => {
  return useQuery({
    queryKey: ["message-template", id],
    queryFn: () => communicationsService.getTemplateById(id!),
    enabled: !!id,
  });
};

export const useCreateMessageTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageTemplateInput) => communicationsService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
    },
  });
};

export const useUpdateMessageTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMessageTemplateInput }) =>
      communicationsService.updateTemplate(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
      queryClient.invalidateQueries({ queryKey: ["message-template", variables.id] });
    },
  });
};

export const useDeleteMessageTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => communicationsService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
    },
  });
};

// ============= MESSAGES =============
export const useMessages = (filters?: MessageFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["messages", filters, page],
    queryFn: () => communicationsService.getAllMessages(filters, page),
  });
};

export const useMessage = (id: number | null) => {
  return useQuery({
    queryKey: ["message", id],
    queryFn: () => communicationsService.getMessageById(id!),
    enabled: !!id,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageInput) => communicationsService.createMessage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["communication-statistics"] });
    },
  });
};

export const useSendBulkMessages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkMessageInput) => communicationsService.sendBulkMessages(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["communication-statistics"] });
    },
  });
};

export const useRetryFailedMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => communicationsService.retryFailedMessage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["message", id] });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => communicationsService.deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};

// ============= NOTICES =============
export const useNotices = (filters?: NoticeFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["notices", filters, page],
    queryFn: () => communicationsService.getAllNotices(filters, page),
  });
};

export const useNotice = (id: number | null) => {
  return useQuery({
    queryKey: ["notice", id],
    queryFn: () => communicationsService.getNoticeById(id!),
    enabled: !!id,
  });
};

export const useCreateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoticeInput) => communicationsService.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateNoticeInput }) =>
      communicationsService.updateNotice(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice", variables.id] });
    },
  });
};

export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => communicationsService.deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

export const usePublishNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => communicationsService.publishNotice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
    },
  });
};

export const useArchiveNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => communicationsService.archiveNotice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["notice", id] });
    },
  });
};

// ============= STATISTICS =============
export const useCommunicationStatistics = () => {
  return useQuery({
    queryKey: ["communication-statistics"],
    queryFn: () => communicationsService.getStatistics(),
  });
};
