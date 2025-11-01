import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { schoolClassService } from "@/services/schoolClass";
import type { SchoolClass, CreateSchoolClassInput, UpdateSchoolClassInput, SchoolClassFilters } from "@/types/schoolClass";

export const useSchoolClasses = (filters?: SchoolClassFilters) => {
  return useQuery({
    queryKey: ["school-classes", filters],
    queryFn: () => schoolClassService.getAll(filters),
  });
};

export const useSchoolClass = (id: number | null) => {
  return useQuery({
    queryKey: ["school-class", id],
    queryFn: () => schoolClassService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateSchoolClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSchoolClassInput) => schoolClassService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes"] });
    },
  });
};

export const useUpdateSchoolClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSchoolClassInput }) =>
      schoolClassService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["school-classes"] });
      queryClient.invalidateQueries({ queryKey: ["school-class", variables.id] });
    },
  });
};

export const useDeleteSchoolClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => schoolClassService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes"] });
    },
  });
};

export const useSchoolClassStats = (id: number | null) => {
  return useQuery({
    queryKey: ["school-class-stats", id],
    queryFn: () => schoolClassService.getStats(id!),
    enabled: !!id,
  });
};

export const useBulkUpdateSchoolClassStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { ids: number[]; status: boolean }) =>
      schoolClassService.bulkUpdateStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-classes"] });
    },
  });
};
