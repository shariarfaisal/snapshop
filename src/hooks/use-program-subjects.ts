import { programService } from "@/services/program";
import { Program, Subject, CurriculumMapEntry, UpdateCurriculumEntryInput } from "@/types/program";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProgramSubjects = (programId: number, enable=true) => {
  const queryClient = useQueryClient();

  // Subjects by program ID query
  const { data: subjects, isLoading, error, refetch } = useQuery({
    queryKey: [programService.getProgramSubjects.name, programId || ""],
    queryFn: () => programService.getProgramSubjects(programId),
    enabled: !!programId && enable,
    select: (data) => data || { data: [] },
    retry: 1,
  });


  // Subject mutations
  const addSubject = useMutation({
    mutationFn: programService.addProgramSubject,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [programService.getProgramSubjects.name, variables.program_id] });
      queryClient.invalidateQueries({ queryKey: [programService.getProgramById.name, variables.program_id] });
    },
  });

  const updateSubject = useMutation({
    mutationFn: ({ program_id, subject_id, data }: { program_id: number; subject_id: number; data: UpdateCurriculumEntryInput }) => 
      programService.updateProgramSubject(program_id, subject_id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [programService.getProgramSubjects.name, variables.program_id] });
      queryClient.invalidateQueries({ queryKey: [programService.getProgramById.name, variables.program_id] });
    },
  });

  const removeSubject = useMutation({
    mutationFn: ({ program_id, subject_id }: { program_id: number; subject_id: number }) => 
      programService.removeProgramSubject(program_id, subject_id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [programService.getProgramSubjects.name, variables.program_id] });
      queryClient.invalidateQueries({ queryKey: [programService.getProgramById.name, variables.program_id] });
    },
  });

  const invalidateProgramSubjects = (programId: string) => {
    queryClient.invalidateQueries({ queryKey: [programService.getProgramSubjects.name, programId] });
  };

  return {
    subjects,
    isLoading,
    error,
    refetch,
    addSubject,
    updateSubject,
    removeSubject,
    invalidateProgramSubjects,
  };
}; 