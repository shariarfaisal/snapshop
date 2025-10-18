import { Program, Subject } from "./program";
import { User } from "./user";

export type CourseStatus = "Upcoming" | "InProgress" | "Completed" | "Cancelled";

export interface CourseOffering {
  id: string;
  subjectId: string;
  subject?: Subject;
  programId: string;
  program?: Program;
  instructorId: string;
  instructor?: User;
  academicYear: string;
  term: number;
  startDate: string;
  endDate: string;
  status: CourseStatus;
  maxStudents: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type EnrollmentStatus = "Pending" | "Approved" | "Rejected" | "Withdrawn" | "Completed";

export interface Enrollment {
  id: string;
  studentId: string;
  student?: User;
  courseOfferingId: string;
  courseOffering?: CourseOffering;
  status: EnrollmentStatus;
  enrollmentDate: string;
  grade?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnrollmentWithDetails extends Enrollment {
  student: User;
  courseOffering: CourseOffering & {
    subject: Subject;
    program: Program;
    instructor: User;
  };
} 