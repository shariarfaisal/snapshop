import { enrollmentService } from "@/services/enrollment";
import { Enrollment, EnrollmentStatus } from "@/types/course-offering";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEnrollment = () => {
  const queryClient = useQueryClient();

  // Enrollments queries
  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading,
    error: enrollmentsError,
    refetch: refetchEnrollments,
  } = useQuery({
    queryKey: ["enrollments"],
    queryFn: () => enrollmentService.getAll(),
  });

  // Enrollment by ID query
  const getEnrollmentById = (id: string) => 
    useQuery({
      queryKey: ["enrollment", id],
      queryFn: () => enrollmentService.getById(id),
      enabled: !!id,
    });

  // Enrollments by course offering ID query
  const getEnrollmentsByCourseOffering = (courseOfferingId: string) =>
    useQuery({
      queryKey: ["enrollments-by-course-offering", courseOfferingId],
      queryFn: () => enrollmentService.getEnrollmentsByCourseOffering(courseOfferingId),
      enabled: !!courseOfferingId,
    });

  // Enrollments by student ID query
  const getEnrollmentsByStudent = (studentId: string) =>
    useQuery({
      queryKey: ["enrollments-by-student", studentId],
      queryFn: () => enrollmentService.getEnrollmentsByStudent(studentId),
      enabled: !!studentId,
    });

  // Enrollment mutations
  const createEnrollment = useMutation({
    mutationFn: enrollmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });

  const updateEnrollmentStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnrollmentStatus }) => 
      enrollmentService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", variables.id] });
    },
  });

  const updateEnrollmentGrade = useMutation({
    mutationFn: ({ id, grade, feedback }: { id: string; grade: number; feedback?: string }) => 
      enrollmentService.updateGrade(id, grade, feedback),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", variables.id] });
    },
  });

  const deleteEnrollment = useMutation({
    mutationFn: enrollmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });

  const batchApproveEnrollments = useMutation({
    mutationFn: enrollmentService.batchApproveEnrollments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });

  const batchRejectEnrollments = useMutation({
    mutationFn: enrollmentService.batchRejectEnrollments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });

  // Cache invalidation
  const invalidateEnrollments = () => {
    queryClient.invalidateQueries({ queryKey: ["enrollments"] });
  };

  const invalidateEnrollmentById = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["enrollment", id] });
  };

  return {
    // Queries
    enrollments,
    isEnrollmentsLoading,
    enrollmentsError,
    refetchEnrollments,
    getEnrollmentById,
    getEnrollmentsByCourseOffering,
    getEnrollmentsByStudent,
    
    // Mutations
    createEnrollment,
    updateEnrollmentStatus,
    updateEnrollmentGrade,
    deleteEnrollment,
    batchApproveEnrollments,
    batchRejectEnrollments,
    
    // Cache invalidation
    invalidateEnrollments,
    invalidateEnrollmentById,
  };
}; 