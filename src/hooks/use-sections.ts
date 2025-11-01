import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionService } from "@/services/section";
import type { CreateSectionInput, UpdateSectionInput, SectionFilters } from "@/types/section";

export const useSections = (filters?: SectionFilters) => {
  return useQuery({
    queryKey: ["sections", filters],
    queryFn: () => sectionService.getAll(filters),
  });
};

export const useSection = (id: number | null) => {
  return useQuery({
    queryKey: ["section", id],
    queryFn: () => sectionService.getById(id!),
    enabled: !!id,
  });
};

export const useSectionsBySchoolClass = (schoolClassId: number | null) => {
  return useQuery({
    queryKey: ["sections-by-class", schoolClassId],
    queryFn: () => sectionService.getBySchoolClass(schoolClassId!),
    enabled: !!schoolClassId,
  });
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSectionInput) => sectionService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSectionInput }) =>
      sectionService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      queryClient.invalidateQueries({ queryKey: ["section", variables.id] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sectionService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
  });
};

export const useSectionStats = (id: number | null) => {
  return useQuery({
    queryKey: ["section-stats", id],
    queryFn: () => sectionService.getStats(id!),
    enabled: !!id,
  });
};
