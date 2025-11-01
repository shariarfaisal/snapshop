import { studentService } from "@/services/student";
import {
  StudentFilters,
  CreateStudentInput,
  UpdateStudentInput,
  CreateStudentMedicalInput,
  UpdateStudentMedicalInput,
  CreateStudentGuardianInput,
  UpdateStudentGuardianInput
} from "@/types/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ============= STUDENTS =============
export const useStudents = (filters?: StudentFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["students", filters, page],
    queryFn: () => studentService.getAll(filters, page),
  });
};

export const useStudent = (id: number | null) => {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => studentService.getById(id!),
    enabled: !!id,
  });
};

export const useStudentByUserId = (userId: string | null) => {
  return useQuery({
    queryKey: ["student-by-user", userId],
    queryFn: () => studentService.getByUserId(userId!),
    enabled: !!userId,
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentInput) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-statistics"] });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateStudentInput }) =>
      studentService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["student-statistics"] });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-statistics"] });
    },
  });
};

export const useBulkUpdateStudentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentIds, status }: { studentIds: number[]; status: string }) =>
      studentService.bulkUpdateStatus(studentIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-statistics"] });
    },
  });
};

export const useBulkAssignClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentIds, classId, sectionId }: { studentIds: number[]; classId: number; sectionId?: number }) =>
      studentService.bulkAssignClass(studentIds, classId, sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};

export const useExportStudents = () => {
  return useMutation({
    mutationFn: (filters?: StudentFilters) => studentService.export(filters),
  });
};

export const useStudentStatistics = () => {
  return useQuery({
    queryKey: ["student-statistics"],
    queryFn: () => studentService.getStatistics(),
  });
};

export const useChangeStudentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      studentService.changeStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["student-statistics"] });
    },
  });
};

// ============= MEDICAL RECORDS =============
export const useStudentMedical = (studentId: string | null) => {
  return useQuery({
    queryKey: ["student-medical", studentId],
    queryFn: () => studentService.getMedicalRecord(studentId!),
    enabled: !!studentId,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentMedicalInput) => studentService.createMedicalRecord(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-medical", variables.studentId] });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, data }: { studentId: string; data: UpdateStudentMedicalInput }) =>
      studentService.updateMedicalRecord(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-medical", variables.studentId] });
    },
  });
};

// ============= GUARDIANS =============
export const useStudentGuardians = (studentId: string | null) => {
  return useQuery({
    queryKey: ["student-guardians", studentId],
    queryFn: () => studentService.getGuardians(studentId!),
    enabled: !!studentId,
  });
};

export const useAddGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStudentGuardianInput) => studentService.addGuardian(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-guardians", variables.studentId] });
    },
  });
};

export const useUpdateGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ guardianId, data }: { guardianId: string; data: UpdateStudentGuardianInput }) =>
      studentService.updateGuardian(guardianId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-guardians"] });
    },
  });
};

export const useDeleteGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guardianId: string) => studentService.deleteGuardian(guardianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-guardians"] });
    },
  });
}; 