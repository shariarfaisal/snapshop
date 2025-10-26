import { $clientPrivate } from "./client";
import type {
  Notification,
  NotificationDetails,
  UserNotification,
} from "@/types/notification";

export const notificationService = {
  getAllNotifications: async (params?: {
    role?: string;
    channel?: string;
    status?: string;
    search?: string;
  }) => {
    const response = await $clientPrivate.get<Notification[]>("/notifications", {
      params,
    });
    return response.data;
  },

  getNotificationById: async (id: string) => {
    const response = await $clientPrivate.get<NotificationDetails>(
      `/notifications/${id}`
    );
    return response.data;
  },

  createNotification: async (data: Omit<Notification, "id" | "createdAt" | "createdBy" | "status" | "sentAt">) => {
    const response = await $clientPrivate.post<Notification>("/notifications", data);
    return response.data;
  },

  resendNotification: async (id: string) => {
    const response = await $clientPrivate.post<Notification>(
      `/notifications/${id}/resend`
    );
    return response.data;
  },

  deleteNotification: async (id: string) => {
    await $clientPrivate.delete(`/notifications/${id}`);
  },

  getUserNotifications: async () => {
    const response = await $clientPrivate.get<UserNotification[]>(
      "/user-notifications"
    );
    return response.data;
  },

  markNotificationAsRead: async (id: string) => {
    const response = await $clientPrivate.put<UserNotification>(
      `/user-notifications/${id}/mark-read`
    );
    return response.data;
  },
}; 