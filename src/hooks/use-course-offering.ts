import { courseOfferingService } from "@/services/course-offering";
import { CourseOffering } from "@/types/course-offering";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCourseOffering = () => {
  const queryClient = useQueryClient();

  // Course offerings queries
  const {
    data: courseOfferings,
    isLoading: isCourseOfferingsLoading,
    error: courseOfferingsError,
    refetch: refetchCourseOfferings,
  } = useQuery({
    queryKey: ["course-offerings"],
    queryFn: () => courseOfferingService.getAll(),
  });

  // Course offering by ID query
  const getCourseOfferingById = (id: string) => 
    useQuery({
      queryKey: ["course-offering", id],
      queryFn: () => courseOfferingService.getById(id),
      enabled: !!id,
    });

  // Course offerings by program ID query
  const getCourseOfferingsByProgram = (programId: string) =>
    useQuery({
      queryKey: ["course-offerings-by-program", programId],
      queryFn: () => courseOfferingService.getCourseOfferingsByProgram(programId),
      enabled: !!programId,
    });

  // Course offerings by subject ID query
  const getCourseOfferingsBySubject = (subjectId: string) =>
    useQuery({
      queryKey: ["course-offerings-by-subject", subjectId],
      queryFn: () => courseOfferingService.getCourseOfferingsBySubject(subjectId),
      enabled: !!subjectId,
    });

  // Course offerings by instructor ID query
  const getCourseOfferingsByInstructor = (instructorId: string) =>
    useQuery({
      queryKey: ["course-offerings-by-instructor", instructorId],
      queryFn: () => courseOfferingService.getCourseOfferingsByInstructor(instructorId),
      enabled: !!instructorId,
    });

  // Course offerings by term query
  const getCourseOfferingsByTerm = (academicYear: string, term: number) =>
    useQuery({
      queryKey: ["course-offerings-by-term", academicYear, term],
      queryFn: () => courseOfferingService.getCourseOfferingsByTerm(academicYear, term),
      enabled: !!academicYear && !!term,
    });

  // Course offering mutations
  const createCourseOffering = useMutation({
    mutationFn: courseOfferingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
    },
  });

  const updateCourseOffering = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CourseOffering> }) => 
      courseOfferingService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
      queryClient.invalidateQueries({ queryKey: ["course-offering", variables.id] });
    },
  });

  const deleteCourseOffering = useMutation({
    mutationFn: courseOfferingService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
    },
  });

  // Cache invalidation
  const invalidateCourseOfferings = () => {
    queryClient.invalidateQueries({ queryKey: ["course-offerings"] });
  };

  const invalidateCourseOfferingById = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["course-offering", id] });
  };

  return {
    // Queries
    courseOfferings,
    isCourseOfferingsLoading,
    courseOfferingsError,
    refetchCourseOfferings,
    getCourseOfferingById,
    getCourseOfferingsByProgram,
    getCourseOfferingsBySubject,
    getCourseOfferingsByInstructor,
    getCourseOfferingsByTerm,
    
    // Mutations
    createCourseOffering,
    updateCourseOffering,
    deleteCourseOffering,
    
    // Cache invalidation
    invalidateCourseOfferings,
    invalidateCourseOfferingById,
  };
}; 