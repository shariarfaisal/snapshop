import { $clientPrivate } from "@/lib/api-client";
import {
  Message,
  MessageTemplate,
  Notice,
  CreateMessageInput,
  CreateMessageTemplateInput,
  CreateNoticeInput,
  UpdateMessageTemplateInput,
  UpdateNoticeInput,
  BulkMessageInput,
  MessageFilters,
  NoticeFilters,
  TemplateFilters,
  PaginatedResponse,
  CommunicationStatistics,
} from "@/types/communications";

class CommunicationsService {
  // Message Templates
  async getAllTemplates(
    filters: TemplateFilters = {},
    page: number = 1
  ): Promise<PaginatedResponse<MessageTemplate>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (filters.type) params.append("type", filters.type);
    if (filters.is_active !== undefined)
      params.append("is_active", filters.is_active ? "1" : "0");
    if (filters.search) params.append("search", filters.search);
    if (filters.per_page) params.append("per_page", filters.per_page.toString());

    const response = await $clientPrivate.get(`/message-templates?${params.toString()}`);
    return response.data;
  }

  async getTemplateById(id: number): Promise<MessageTemplate> {
    const response = await $clientPrivate.get(`/message-templates/${id}`);
    return response.data.data;
  }

  async createTemplate(
    data: CreateMessageTemplateInput
  ): Promise<MessageTemplate> {
    const response = await $clientPrivate.post("/message-templates", data);
    return response.data.data;
  }

  async updateTemplate(
    id: number,
    data: UpdateMessageTemplateInput
  ): Promise<MessageTemplate> {
    const response = await $clientPrivate.put(`/message-templates/${id}`, data);
    return response.data.data;
  }

  async deleteTemplate(id: number): Promise<void> {
    await $clientPrivate.delete(`/message-templates/${id}`);
  }

  // Messages
  async getAllMessages(
    filters: MessageFilters = {},
    page: number = 1
  ): Promise<PaginatedResponse<Message>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);
    if (filters.search) params.append("search", filters.search);
    if (filters.from_date) params.append("from_date", filters.from_date);
    if (filters.to_date) params.append("to_date", filters.to_date);
    if (filters.per_page) params.append("per_page", filters.per_page.toString());

    const response = await $clientPrivate.get(`/messages?${params.toString()}`);
    return response.data;
  }

  async getMessageById(id: number): Promise<Message> {
    const response = await $clientPrivate.get(`/messages/${id}`);
    return response.data.data;
  }

  async createMessage(data: CreateMessageInput): Promise<Message> {
    const response = await $clientPrivate.post("/messages", data);
    return response.data.data;
  }

  async sendBulkMessages(data: BulkMessageInput): Promise<{ sent: number }> {
    const response = await $clientPrivate.post("/messages/bulk-send", data);
    return response.data;
  }

  async retryFailedMessage(id: number): Promise<Message> {
    const response = await $clientPrivate.post(`/messages/${id}/retry`);
    return response.data.data;
  }

  async deleteMessage(id: number): Promise<void> {
    await $clientPrivate.delete(`/messages/${id}`);
  }

  // Notices
  async getAllNotices(
    filters: NoticeFilters = {},
    page: number = 1
  ): Promise<PaginatedResponse<Notice>> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.search) params.append("search", filters.search);
    if (filters.target_role) params.append("target_role", filters.target_role);
    if (filters.per_page) params.append("per_page", filters.per_page.toString());

    const response = await $clientPrivate.get(`/notices?${params.toString()}`);
    return response.data;
  }

  async getNoticeById(id: number): Promise<Notice> {
    const response = await $clientPrivate.get(`/notices/${id}`);
    return response.data.data;
  }

  async createNotice(data: CreateNoticeInput): Promise<Notice> {
    const response = await $clientPrivate.post("/notices", data);
    return response.data.data;
  }

  async updateNotice(id: number, data: UpdateNoticeInput): Promise<Notice> {
    const response = await $clientPrivate.put(`/notices/${id}`, data);
    return response.data.data;
  }

  async deleteNotice(id: number): Promise<void> {
    await $clientPrivate.delete(`/notices/${id}`);
  }

  async publishNotice(id: number): Promise<Notice> {
    const response = await $clientPrivate.post(`/notices/${id}/publish`);
    return response.data.data;
  }

  async archiveNotice(id: number): Promise<Notice> {
    const response = await $clientPrivate.post(`/notices/${id}/archive`);
    return response.data.data;
  }

  // Statistics
  async getStatistics(): Promise<CommunicationStatistics> {
    const response = await $clientPrivate.get("/communications/statistics");
    return response.data;
  }
}

export const communicationsService = new CommunicationsService();
