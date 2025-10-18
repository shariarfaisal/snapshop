import { programService } from "@/services/program";
import { Program, Subject } from "@/types/program";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProgram = () => {
  const queryClient = useQueryClient();

  // Programs queries
  const {
    data: programs,
    isLoading: isProgramsLoading,
    error: programsError,
    refetch: refetchPrograms,
  } = useQuery({
    queryKey: [programService.getAllPrograms.name],
    queryFn: programService.getAllPrograms,
  });

  // Program by ID query
  const getProgramById = (id: string) => 
    useQuery({
      queryKey: [programService.getProgramById.name, id],
      queryFn: () => programService.getProgramById(id),
      enabled: !!id,
    });


  // Program mutations
  const createProgram = useMutation({
    mutationFn: programService.createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [programService.getAllPrograms.name] });
    },
  });

  const updateProgram = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Program> }) => 
      programService.updateProgram(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [programService.getAllPrograms.name] });
      queryClient.invalidateQueries({ queryKey: [programService.getProgramById.name, variables.id] });
      queryClient.invalidateQueries({ queryKey: [programService.getProgramSubjects.name, variables.id] });
    },
  });

  const deleteProgram = useMutation({
    mutationFn: programService.deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [programService.getAllPrograms.name] });
    },
  });

  // Cache invalidation
  const invalidatePrograms = () => {
    queryClient.invalidateQueries({ queryKey: [programService.getAllPrograms.name] });
  };

  const invalidateProgramById = (id: string) => {
    queryClient.invalidateQueries({ queryKey: [programService.getProgramById.name, id] });
  };

  const invalidateProgramSubjects = (programId: string) => {
    queryClient.invalidateQueries({ queryKey: [programService.getProgramSubjects.name, programId] });
  };

  return {
    // Queries
    programs,
    isProgramsLoading,
    programsError,
    refetchPrograms,
    getProgramById,
    
    // Program operations
    createProgram,
    updateProgram,
    deleteProgram,

    
    // Cache invalidation
    invalidatePrograms,
    invalidateProgramById,
    invalidateProgramSubjects,
  };
}; 