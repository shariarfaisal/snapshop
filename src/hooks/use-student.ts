import { studentService } from "@/services/student";
import { 
  StudentProfile, 
  UpdateStudentProfileInput,
  CreateStudentProfileInput,
  StudentMedical,
  CreateStudentMedicalInput,
  UpdateStudentMedicalInput,
  StudentGuardian,
  CreateStudentGuardianInput,
  UpdateStudentGuardianInput
} from "@/types/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useStudent = () => {
  const queryClient = useQueryClient();

  // Student profile queries
  const {
    data: students,
    isLoading: isStudentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.getAll(),
  });

  // Student by ID query
  const getStudentById = (id: string) => 
    useQuery({
      queryKey: ["student", id],
      queryFn: () => studentService.getById(id),
      enabled: !!id,
    });

  // Student by user ID query
  const getStudentByUserId = (userId: string) =>
    useQuery({
      queryKey: ["student-by-user", userId],
      queryFn: () => studentService.getByUserId(userId),
      enabled: !!userId,
    });

  // Medical record query
  const getStudentMedical = (studentId: string) =>
    useQuery({
      queryKey: ["student-medical", studentId],
      queryFn: () => studentService.getMedicalRecord(studentId),
      enabled: !!studentId,
    });

  // Guardians query
  const getStudentGuardians = (studentId: string) =>
    useQuery({
      queryKey: ["student-guardians", studentId],
      queryFn: () => studentService.getGuardians(studentId),
      enabled: !!studentId,
    });

  // Student profile mutations
  const createStudentProfile = useMutation({
    mutationFn: studentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const updateStudentProfile = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentProfileInput }) => 
      studentService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
    },
  });

  const deleteStudentProfile = useMutation({
    mutationFn: studentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const changeStudentStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      studentService.changeStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
    },
  });

  // Medical record mutations
  const createMedicalRecord = useMutation({
    mutationFn: studentService.createMedicalRecord,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-medical", variables.studentId] });
    },
  });

  const updateMedicalRecord = useMutation({
    mutationFn: ({ studentId, data }: { studentId: string; data: UpdateStudentMedicalInput }) => 
      studentService.updateMedicalRecord(studentId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-medical", variables.studentId] });
    },
  });

  // Guardian mutations
  const addGuardian = useMutation({
    mutationFn: studentService.addGuardian,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["student-guardians", variables.studentId] });
    },
  });

  const updateGuardian = useMutation({
    mutationFn: ({ guardianId, data }: { guardianId: string; data: UpdateStudentGuardianInput }) => 
      studentService.updateGuardian(guardianId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-guardians"] });
    },
  });

  const deleteGuardian = useMutation({
    mutationFn: studentService.deleteGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-guardians"] });
    },
  });

  // Cache invalidation
  const invalidateStudents = () => {
    queryClient.invalidateQueries({ queryKey: ["students"] });
  };

  const invalidateStudentById = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["student", id] });
  };

  return {
    // Queries
    students,
    isStudentsLoading,
    studentsError,
    refetchStudents,
    getStudentById,
    getStudentByUserId,
    getStudentMedical,
    getStudentGuardians,
    
    // Student profile mutations
    createStudentProfile,
    updateStudentProfile,
    deleteStudentProfile,
    changeStudentStatus,
    
    // Medical record mutations
    createMedicalRecord,
    updateMedicalRecord,
    
    // Guardian mutations
    addGuardian,
    updateGuardian,
    deleteGuardian,
    
    // Cache invalidation
    invalidateStudents,
    invalidateStudentById,
  };
}; 