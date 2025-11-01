import { api } from "@/lib/api-client";
import {
  Exam,
  ExamSubject,
  Mark,
  GradeScale,
  CreateExamInput,
  UpdateExamInput,
  CreateExamSubjectInput,
  CreateMarkInput,
  BulkCreateMarksInput,
  CreateGradeScaleInput,
  ExamRoom,
  CreateExamRoomInput,
  UpdateExamRoomInput,
  RoomAvailability,
  ExamParticipant,
  CreateParticipantInput,
  BulkCreateParticipantsInput,
  ParticipantStats,
  SeatAllocation,
  AllocateSeatsInput,
  AllocateByRoomInput,
  SeatPlan,
  AdmitCard,
  GenerateAdmitCardInput,
  BulkGenerateAdmitCardsInput,
  AdmitCardData,
  ExamRanking,
  GenerateRankingsInput,
  MeritListFilters,
  ExamInvigilator,
  CreateInvigilatorInput
} from "@/types/exam";

export const examService = {
  // Exams
  getAll: async (filters?: Record<string, any>): Promise<Exam[]> => {
    const params = filters ? { params: filters } : undefined;
    return api.get<Exam[]>("/exams", params);
  },

  getById: async (id: number): Promise<Exam> => {
    return api.get<Exam>(`/exams/${id}`);
  },

  create: async (data: CreateExamInput): Promise<Exam> => {
    return api.post<Exam>("/exams", data);
  },

  update: async (id: number, data: UpdateExamInput): Promise<Exam> => {
    return api.put<Exam>(`/exams/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/exams/${id}`);
  },

  getSubjects: async (examId: number): Promise<ExamSubject[]> => {
    return api.get<ExamSubject[]>(`/exams/${examId}/subjects`);
  },

  addSubject: async (examId: number, data: CreateExamSubjectInput): Promise<ExamSubject> => {
    return api.post<ExamSubject>(`/exams/${examId}/subjects`, data);
  },

  updateSubject: async (examId: number, subjectId: number, data: Partial<CreateExamSubjectInput>): Promise<ExamSubject> => {
    return api.put<ExamSubject>(`/exams/${examId}/subjects/${subjectId}`, data);
  },

  removeSubject: async (examId: number, subjectId: number): Promise<void> => {
    return api.delete<void>(`/exams/${examId}/subjects/${subjectId}`);
  },

  getSchedule: async (examId: number): Promise<ExamSubject[]> => {
    return api.get<ExamSubject[]>(`/exams/${examId}/schedule`);
  },

  publishResults: async (examId: number): Promise<Exam> => {
    return api.post<Exam>(`/exams/${examId}/publish-results`);
  },

  getResults: async (examId: number): Promise<any[]> => {
    return api.get<any[]>(`/exams/${examId}/results`);
  },
};

export const markService = {
  getAll: async (filters?: Record<string, any>): Promise<Mark[]> => {
    const params = filters ? { params: filters } : undefined;
    return api.get<Mark[]>("/marks", params);
  },

  getById: async (id: number): Promise<Mark> => {
    return api.get<Mark>(`/marks/${id}`);
  },

  create: async (data: CreateMarkInput): Promise<Mark> => {
    return api.post<Mark>("/marks", data);
  },

  bulkCreate: async (data: BulkCreateMarksInput): Promise<Mark[]> => {
    return api.post<Mark[]>("/marks/bulk", data);
  },

  update: async (id: number, data: Partial<CreateMarkInput>): Promise<Mark> => {
    return api.put<Mark>(`/marks/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/marks/${id}`);
  },

  byExam: async (examId: number): Promise<Mark[]> => {
    return api.get<Mark[]>(`/marks/exam/${examId}`);
  },

  byExamSubject: async (examId: number, subjectId: number): Promise<Mark[]> => {
    return api.get<Mark[]>(`/marks/exam/${examId}/subject/${subjectId}`);
  },

  studentExam: async (studentId: number, examId: number): Promise<Mark[]> => {
    return api.get<Mark[]>(`/marks/student/${studentId}/exam/${examId}`);
  },
};

export const gradeScaleService = {
  getAll: async (): Promise<GradeScale[]> => {
    return api.get<GradeScale[]>("/grade-scales");
  },

  getById: async (id: number): Promise<GradeScale> => {
    return api.get<GradeScale>(`/grade-scales/${id}`);
  },

  create: async (data: CreateGradeScaleInput): Promise<GradeScale> => {
    return api.post<GradeScale>("/grade-scales", data);
  },

  update: async (id: number, data: Partial<CreateGradeScaleInput>): Promise<GradeScale> => {
    return api.put<GradeScale>(`/grade-scales/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/grade-scales/${id}`);
  },
};

export const examRoomService = {
  getAll: async (filters?: Record<string, any>): Promise<ExamRoom[]> => {
    const params = filters ? { params: filters } : undefined;
    return api.get<ExamRoom[]>("/exam-rooms", params);
  },

  getById: async (id: number): Promise<ExamRoom> => {
    return api.get<ExamRoom>(`/exam-rooms/${id}`);
  },

  create: async (data: CreateExamRoomInput): Promise<ExamRoom> => {
    return api.post<ExamRoom>("/exam-rooms", data);
  },

  update: async (id: number, data: UpdateExamRoomInput): Promise<ExamRoom> => {
    return api.put<ExamRoom>(`/exam-rooms/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/exam-rooms/${id}`);
  },

  getAvailability: async (): Promise<RoomAvailability[]> => {
    return api.get<RoomAvailability[]>("/exam-rooms-availability");
  },
};

export const examParticipantService = {
  getAll: async (filters?: Record<string, any>): Promise<ExamParticipant[]> => {
    const params = filters ? { params: filters } : undefined;
    return api.get<ExamParticipant[]>("/exam-participants", params);
  },

  getById: async (id: number): Promise<ExamParticipant> => {
    return api.get<ExamParticipant>(`/exam-participants/${id}`);
  },

  create: async (data: CreateParticipantInput): Promise<ExamParticipant> => {
    return api.post<ExamParticipant>("/exam-participants", data);
  },

  bulkCreate: async (data: BulkCreateParticipantsInput): Promise<ExamParticipant[]> => {
    return api.post<ExamParticipant[]>("/exam-participants/bulk", data);
  },

  registerClass: async (examId: number, classId: number): Promise<ExamParticipant[]> => {
    return api.post<ExamParticipant[]>("/exam-participants/register-class", {
      exam_id: examId,
      class_id: classId,
    });
  },

  update: async (id: number, data: Partial<CreateParticipantInput>): Promise<ExamParticipant> => {
    return api.put<ExamParticipant>(`/exam-participants/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/exam-participants/${id}`);
  },

  byExam: async (examId: number): Promise<ExamParticipant[]> => {
    return api.get<ExamParticipant[]>(`/exam-participants/exam/${examId}`);
  },

  getStats: async (examId: number): Promise<ParticipantStats> => {
    return api.get<ParticipantStats>(`/exam-participants/exam/${examId}/stats`);
  },
};

export const seatAllocationService = {
  allocateAuto: async (data: AllocateSeatsInput): Promise<SeatAllocation[]> => {
    return api.post<SeatAllocation[]>("/seat-allocations/allocate-auto", data);
  },

  allocateByRoom: async (data: AllocateByRoomInput): Promise<SeatAllocation[]> => {
    return api.post<SeatAllocation[]>("/seat-allocations/allocate-by-room", data);
  },

  byExam: async (examId: number): Promise<SeatAllocation[]> => {
    return api.get<SeatAllocation[]>(`/seat-allocations/exam/${examId}`);
  },

  byRoom: async (roomId: number, examId?: number): Promise<SeatAllocation[]> => {
    const params = examId ? { params: { exam_id: examId } } : undefined;
    return api.get<SeatAllocation[]>(`/seat-allocations/room/${roomId}`, params);
  },

  getSeatPlan: async (examId: number): Promise<SeatPlan[]> => {
    return api.get<SeatPlan[]>(`/seat-allocations/exam/${examId}/seat-plan`);
  },

  update: async (id: number, data: Partial<SeatAllocation>): Promise<SeatAllocation> => {
    return api.put<SeatAllocation>(`/seat-allocations/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/seat-allocations/${id}`);
  },

  clear: async (examId: number, examSubjectId?: number): Promise<void> => {
    return api.post<void>("/seat-allocations/clear", {
      exam_id: examId,
      exam_subject_id: examSubjectId,
    });
  },
};

export const admitCardService = {
  generate: async (data: GenerateAdmitCardInput): Promise<AdmitCard> => {
    return api.post<AdmitCard>("/admit-cards/generate", data);
  },

  bulkGenerate: async (data: BulkGenerateAdmitCardsInput): Promise<AdmitCard[]> => {
    return api.post<AdmitCard[]>("/admit-cards/bulk-generate", data);
  },

  byExam: async (examId: number): Promise<AdmitCard[]> => {
    return api.get<AdmitCard[]>(`/admit-cards/exam/${examId}`);
  },

  byParticipant: async (participantId: number): Promise<AdmitCard> => {
    return api.get<AdmitCard>(`/admit-cards/participant/${participantId}`);
  },

  getData: async (participantId: number): Promise<AdmitCardData> => {
    return api.get<AdmitCardData>(`/admit-cards/participant/${participantId}/data`);
  },

  getById: async (id: number): Promise<AdmitCard> => {
    return api.get<AdmitCard>(`/admit-cards/${id}`);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/admit-cards/${id}`);
  },
};

export const examRankingService = {
  generate: async (data: GenerateRankingsInput): Promise<ExamRanking[]> => {
    return api.post<ExamRanking[]>("/exam-rankings/generate", data);
  },

  getMeritList: async (examId: number, filters?: MeritListFilters): Promise<ExamRanking[]> => {
    const params = filters ? { params: filters } : undefined;
    return api.get<ExamRanking[]>(`/exam-rankings/exam/${examId}/merit-list`, params);
  },

  getToppers: async (examId: number, limit?: number, rankType?: string): Promise<ExamRanking[]> => {
    const params: any = {};
    if (limit) params.limit = limit;
    if (rankType) params.rank_type = rankType;
    return api.get<ExamRanking[]>(`/exam-rankings/exam/${examId}/toppers`, { params });
  },

  getStudentRanking: async (examId: number, studentId: number): Promise<ExamRanking[]> => {
    return api.get<ExamRanking[]>(`/exam-rankings/exam/${examId}/student/${studentId}`);
  },
};

export const examInvigilatorService = {
  create: async (data: CreateInvigilatorInput): Promise<ExamInvigilator> => {
    return api.post<ExamInvigilator>("/exam-invigilators", data);
  },

  byExamSubject: async (examSubjectId: number): Promise<ExamInvigilator[]> => {
    return api.get<ExamInvigilator[]>(`/exam-invigilators/exam-subject/${examSubjectId}`);
  },

  byTeacher: async (teacherId: number): Promise<ExamInvigilator[]> => {
    return api.get<ExamInvigilator[]>(`/exam-invigilators/teacher/${teacherId}`);
  },

  update: async (id: number, data: Partial<CreateInvigilatorInput>): Promise<ExamInvigilator> => {
    return api.put<ExamInvigilator>(`/exam-invigilators/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return api.delete<void>(`/exam-invigilators/${id}`);
  },
};
