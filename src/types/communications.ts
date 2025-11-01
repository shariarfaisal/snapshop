// Communications Types

export type MessageType = "sms" | "email";
export type MessageStatus = "queued" | "sent" | "failed" | "bounced";
export type NoticeStatus = "draft" | "published" | "archived";
export type NoticePriority = "low" | "normal" | "high" | "urgent";
export type TemplateType = "sms" | "email" | "both";
export type TargetRole = "student" | "parent" | "teacher" | "staff" | "all";

// Message Template
export interface MessageTemplate {
  id: number;
  institute_id: number;
  name: string;
  slug: string;
  type: TemplateType;
  subject?: string;
  body: string;
  variables?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateMessageTemplateInput {
  name: string;
  slug: string;
  type: TemplateType;
  subject?: string;
  body: string;
  variables?: string[];
  is_active?: boolean;
}

export interface UpdateMessageTemplateInput {
  name?: string;
  slug?: string;
  type?: TemplateType;
  subject?: string;
  body?: string;
  variables?: string[];
  is_active?: boolean;
}

// Message
export interface Message {
  id: number;
  institute_id: number;
  template_id?: number;
  template?: MessageTemplate;
  type: MessageType;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_user_id?: number;
  recipient_user?: any;
  subject?: string;
  body: string;
  status: MessageStatus;
  error_message?: string;
  gateway_response?: any;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMessageInput {
  type: MessageType;
  template_id?: number;
  recipient_email?: string;
  recipient_phone?: string;
  recipient_user_id?: number;
  subject?: string;
  body: string;
}

export interface BulkMessageInput {
  type: MessageType;
  template_id?: number;
  target_roles?: TargetRole[];
  target_classes?: number[];
  target_users?: number[];
  subject?: string;
  body: string;
  variables?: Record<string, string>;
}

// Notice
export interface Notice {
  id: number;
  institute_id: number;
  title: string;
  content: string;
  target_roles?: TargetRole[];
  target_classes?: number[];
  priority: NoticePriority;
  status: NoticeStatus;
  publish_at?: string;
  expire_at?: string;
  created_by: number;
  creator?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateNoticeInput {
  title: string;
  content: string;
  target_roles?: TargetRole[];
  target_classes?: number[];
  priority?: NoticePriority;
  status?: NoticeStatus;
  publish_at?: string;
  expire_at?: string;
}

export interface UpdateNoticeInput {
  title?: string;
  content?: string;
  target_roles?: TargetRole[];
  target_classes?: number[];
  priority?: NoticePriority;
  status?: NoticeStatus;
  publish_at?: string;
  expire_at?: string;
}

// Statistics
export interface CommunicationStatistics {
  total_notices: number;
  active_notices: number;
  total_messages: number;
  sent_messages: number;
  failed_messages: number;
  queued_messages: number;
  total_templates: number;
  sms_count: number;
  email_count: number;
}

// Filters
export interface MessageFilters {
  type?: MessageType;
  status?: MessageStatus;
  search?: string;
  from_date?: string;
  to_date?: string;
  per_page?: number;
}

export interface NoticeFilters {
  status?: NoticeStatus;
  priority?: NoticePriority;
  search?: string;
  target_role?: TargetRole;
  per_page?: number;
}

export interface TemplateFilters {
  type?: TemplateType;
  is_active?: boolean;
  search?: string;
  per_page?: number;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}
