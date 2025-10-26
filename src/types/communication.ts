export interface Guardian {
  id: string;
  name: string;
  relation: string; // e.g., "Father", "Mother"
}

export interface StudentWithGuardian {
  studentId: string;
  studentName: string;
  guardians: Guardian[];
}

export interface Message {
  id: string;
  recipientIds: string[]; // List of guardian IDs
  subject: string;
  body: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'queued';
}
