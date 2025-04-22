export type NotificationType = "Announcement" | "Alert";

export type NotificationChannel = "Email" | "SMS" | "WhatsApp" | "In-app";

export type NotificationStatus = "Queued" | "Sent" | "Failed";

export type NotificationTargetRole = "Student" | "Teacher" | "Guardian" | "Staff";

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  targetRoles: NotificationTargetRole[];
  targetCampus?: string;
  channels: NotificationChannel[];
  status: NotificationStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

export interface NotificationDelivery {
  channel: NotificationChannel;
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

export interface NotificationDetails extends Notification {
  deliveryStats: NotificationDelivery[];
  totalRecipients: number;
}

export interface UserNotification {
  id: string;
  notificationId: string;
  title: string;
  preview: string;
  isRead: boolean;
  createdAt: string;
  notification: {
    body: string;
    type: NotificationType;
  };
} 