import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  examService,
  markService,
  gradeScaleService,
  examRoomService,
  examParticipantService,
  seatAllocationService,
  admitCardService,
  examRankingService,
  examInvigilatorService,
} from "@/services/exam";
import type {
  CreateExamInput,
  UpdateExamInput,
  CreateExamSubjectInput,
  CreateMarkInput,
  BulkCreateMarksInput,
  CreateGradeScaleInput,
  CreateExamRoomInput,
  UpdateExamRoomInput,
  CreateParticipantInput,
  BulkCreateParticipantsInput,
  AllocateSeatsInput,
  AllocateByRoomInput,
  GenerateAdmitCardInput,
  BulkGenerateAdmitCardsInput,
  GenerateRankingsInput,
  MeritListFilters,
  CreateInvigilatorInput,
} from "@/types/exam";

// ============= EXAMS =============
export const useExams = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["exams", filters],
    queryFn: () => examService.getAll(filters),
  });
};

export const useExam = (id: number | null) => {
  return useQuery({
    queryKey: ["exam", id],
    queryFn: () => examService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamInput) => examService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExamInput }) =>
      examService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam", variables.id] });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useExamSubjects = (examId: number | null) => {
  return useQuery({
    queryKey: ["exam-subjects", examId],
    queryFn: () => examService.getSubjects(examId!),
    enabled: !!examId,
  });
};

export const useAddExamSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, data }: { examId: number; data: CreateExamSubjectInput }) =>
      examService.addSubject(examId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-subjects", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["exam-schedule", variables.examId] });
    },
  });
};

export const useUpdateExamSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      subjectId,
      data,
    }: {
      examId: number;
      subjectId: number;
      data: Partial<CreateExamSubjectInput>;
    }) => examService.updateSubject(examId, subjectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-subjects", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["exam-schedule", variables.examId] });
    },
  });
};

export const useRemoveExamSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, subjectId }: { examId: number; subjectId: number }) =>
      examService.removeSubject(examId, subjectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-subjects", variables.examId] });
      queryClient.invalidateQueries({ queryKey: ["exam-schedule", variables.examId] });
    },
  });
};

export const useExamSchedule = (examId: number | null) => {
  return useQuery({
    queryKey: ["exam-schedule", examId],
    queryFn: () => examService.getSchedule(examId!),
    enabled: !!examId,
  });
};

export const usePublishExamResults = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: number) => examService.publishResults(examId),
    onSuccess: (_, examId) => {
      queryClient.invalidateQueries({ queryKey: ["exam", examId] });
      queryClient.invalidateQueries({ queryKey: ["exam-results", examId] });
    },
  });
};

export const useExamResults = (examId: number | null) => {
  return useQuery({
    queryKey: ["exam-results", examId],
    queryFn: () => examService.getResults(examId!),
    enabled: !!examId,
  });
};

// ============= MARKS =============
export const useMarks = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["marks", filters],
    queryFn: () => markService.getAll(filters),
  });
};

export const useMark = (id: number | null) => {
  return useQuery({
    queryKey: ["mark", id],
    queryFn: () => markService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMarkInput) => markService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });
};

export const useBulkCreateMarks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateMarksInput) => markService.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });
};

export const useUpdateMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateMarkInput> }) =>
      markService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      queryClient.invalidateQueries({ queryKey: ["mark", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });
};

export const useDeleteMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marks"] });
      queryClient.invalidateQueries({ queryKey: ["exam-results"] });
    },
  });
};

export const useMarksByExam = (examId: number | null) => {
  return useQuery({
    queryKey: ["marks-by-exam", examId],
    queryFn: () => markService.byExam(examId!),
    enabled: !!examId,
  });
};

export const useMarksByExamSubject = (examId: number | null, subjectId: number | null) => {
  return useQuery({
    queryKey: ["marks-by-exam-subject", examId, subjectId],
    queryFn: () => markService.byExamSubject(examId!, subjectId!),
    enabled: !!examId && !!subjectId,
  });
};

export const useStudentExamMarks = (studentId: number | null, examId: number | null) => {
  return useQuery({
    queryKey: ["student-exam-marks", studentId, examId],
    queryFn: () => markService.studentExam(studentId!, examId!),
    enabled: !!studentId && !!examId,
  });
};

// ============= GRADE SCALES =============
export const useGradeScales = () => {
  return useQuery({
    queryKey: ["grade-scales"],
    queryFn: () => gradeScaleService.getAll(),
  });
};

export const useGradeScale = (id: number | null) => {
  return useQuery({
    queryKey: ["grade-scale", id],
    queryFn: () => gradeScaleService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateGradeScale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGradeScaleInput) => gradeScaleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade-scales"] });
    },
  });
};

export const useUpdateGradeScale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateGradeScaleInput> }) =>
      gradeScaleService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["grade-scales"] });
      queryClient.invalidateQueries({ queryKey: ["grade-scale", variables.id] });
    },
  });
};

export const useDeleteGradeScale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => gradeScaleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grade-scales"] });
    },
  });
};

// ============= EXAM ROOMS =============
export const useExamRooms = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["exam-rooms", filters],
    queryFn: () => examRoomService.getAll(filters),
  });
};

export const useExamRoom = (id: number | null) => {
  return useQuery({
    queryKey: ["exam-room", id],
    queryFn: () => examRoomService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateExamRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamRoomInput) => examRoomService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["exam-room-availability"] });
    },
  });
};

export const useUpdateExamRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateExamRoomInput }) =>
      examRoomService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["exam-room", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["exam-room-availability"] });
    },
  });
};

export const useDeleteExamRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examRoomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["exam-room-availability"] });
    },
  });
};

export const useExamRoomAvailability = () => {
  return useQuery({
    queryKey: ["exam-room-availability"],
    queryFn: () => examRoomService.getAvailability(),
  });
};

// ============= EXAM PARTICIPANTS =============
export const useExamParticipants = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: ["exam-participants", filters],
    queryFn: () => examParticipantService.getAll(filters),
  });
};

export const useExamParticipant = (id: number | null) => {
  return useQuery({
    queryKey: ["exam-participant", id],
    queryFn: () => examParticipantService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateExamParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParticipantInput) => examParticipantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-participants"] });
    },
  });
};

export const useBulkCreateExamParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateParticipantsInput) => examParticipantService.bulkCreate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-participants"] });
    },
  });
};

export const useRegisterClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, classId }: { examId: number; classId: number }) =>
      examParticipantService.registerClass(examId, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-participants"] });
    },
  });
};

export const useUpdateExamParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateParticipantInput> }) =>
      examParticipantService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exam-participants"] });
      queryClient.invalidateQueries({ queryKey: ["exam-participant", variables.id] });
    },
  });
};

export const useDeleteExamParticipant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examParticipantService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-participants"] });
    },
  });
};

export const useExamParticipantsByExam = (examId: number | null) => {
  return useQuery({
    queryKey: ["exam-participants-by-exam", examId],
    queryFn: () => examParticipantService.byExam(examId!),
    enabled: !!examId,
  });
};

export const useExamParticipantStats = (examId: number | null) => {
  return useQuery({
    queryKey: ["exam-participant-stats", examId],
    queryFn: () => examParticipantService.getStats(examId!),
    enabled: !!examId,
  });
};

// ============= SEAT ALLOCATIONS =============
export const useAllocateSeatsAuto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AllocateSeatsInput) => seatAllocationService.allocateAuto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["seat-plan"] });
    },
  });
};

export const useAllocateSeatsByRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AllocateByRoomInput) => seatAllocationService.allocateByRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["seat-plan"] });
    },
  });
};

export const useSeatAllocationsByExam = (examId: number | null) => {
  return useQuery({
    queryKey: ["seat-allocations-by-exam", examId],
    queryFn: () => seatAllocationService.byExam(examId!),
    enabled: !!examId,
  });
};

export const useSeatAllocationsByRoom = (roomId: number | null, examId?: number) => {
  return useQuery({
    queryKey: ["seat-allocations-by-room", roomId, examId],
    queryFn: () => seatAllocationService.byRoom(roomId!, examId),
    enabled: !!roomId,
  });
};

export const useSeatPlan = (examId: number | null) => {
  return useQuery({
    queryKey: ["seat-plan", examId],
    queryFn: () => seatAllocationService.getSeatPlan(examId!),
    enabled: !!examId,
  });
};

export const useUpdateSeatAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<any> }) =>
      seatAllocationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["seat-plan"] });
    },
  });
};

export const useDeleteSeatAllocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => seatAllocationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["seat-plan"] });
    },
  });
};

export const useClearSeatAllocations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, examSubjectId }: { examId: number; examSubjectId?: number }) =>
      seatAllocationService.clear(examId, examSubjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seat-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["seat-plan"] });
    },
  });
};

// ============= ADMIT CARDS =============
export const useGenerateAdmitCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateAdmitCardInput) => admitCardService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admit-cards"] });
    },
  });
};

export const useBulkGenerateAdmitCards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkGenerateAdmitCardsInput) => admitCardService.bulkGenerate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admit-cards"] });
    },
  });
};

export const useAdmitCardsByExam = (examId: number | null) => {
  return useQuery({
    queryKey: ["admit-cards-by-exam", examId],
    queryFn: () => admitCardService.byExam(examId!),
    enabled: !!examId,
  });
};

export const useAdmitCardByParticipant = (participantId: number | null) => {
  return useQuery({
    queryKey: ["admit-card-by-participant", participantId],
    queryFn: () => admitCardService.byParticipant(participantId!),
    enabled: !!participantId,
  });
};

export const useAdmitCardData = (participantId: number | null) => {
  return useQuery({
    queryKey: ["admit-card-data", participantId],
    queryFn: () => admitCardService.getData(participantId!),
    enabled: !!participantId,
  });
};

export const useAdmitCard = (id: number | null) => {
  return useQuery({
    queryKey: ["admit-card", id],
    queryFn: () => admitCardService.getById(id!),
    enabled: !!id,
  });
};

export const useDeleteAdmitCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => admitCardService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admit-cards"] });
    },
  });
};

// ============= RANKINGS & MERIT LIST =============
export const useGenerateRankings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GenerateRankingsInput) => examRankingService.generate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-rankings"] });
      queryClient.invalidateQueries({ queryKey: ["merit-list"] });
    },
  });
};

export const useMeritList = (examId: number | null, filters?: MeritListFilters) => {
  return useQuery({
    queryKey: ["merit-list", examId, filters],
    queryFn: () => examRankingService.getMeritList(examId!, filters),
    enabled: !!examId,
  });
};

export const useToppers = (examId: number | null, limit?: number, rankType?: string) => {
  return useQuery({
    queryKey: ["toppers", examId, limit, rankType],
    queryFn: () => examRankingService.getToppers(examId!, limit, rankType),
    enabled: !!examId,
  });
};

export const useStudentRanking = (examId: number | null, studentId: number | null) => {
  return useQuery({
    queryKey: ["student-ranking", examId, studentId],
    queryFn: () => examRankingService.getStudentRanking(examId!, studentId!),
    enabled: !!examId && !!studentId,
  });
};

// ============= INVIGILATORS =============
export const useCreateInvigilator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvigilatorInput) => examInvigilatorService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invigilators"] });
    },
  });
};

export const useInvigilatorsByExamSubject = (examSubjectId: number | null) => {
  return useQuery({
    queryKey: ["invigilators-by-exam-subject", examSubjectId],
    queryFn: () => examInvigilatorService.byExamSubject(examSubjectId!),
    enabled: !!examSubjectId,
  });
};

export const useInvigilatorsByTeacher = (teacherId: number | null) => {
  return useQuery({
    queryKey: ["invigilators-by-teacher", teacherId],
    queryFn: () => examInvigilatorService.byTeacher(teacherId!),
    enabled: !!teacherId,
  });
};

export const useUpdateInvigilator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateInvigilatorInput> }) =>
      examInvigilatorService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invigilators"] });
    },
  });
};

export const useDeleteInvigilator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => examInvigilatorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invigilators"] });
    },
  });
};
