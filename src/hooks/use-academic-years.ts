import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { academicYearService } from "@/services/api/academic-year";
import type { CreateAcademicYearRequest, UpdateAcademicYearRequest } from "@/services/api/academic-year";

export const useAcademicYears = (params?: { status?: 'active' | 'inactive' }) => {
  return useQuery({
    queryKey: ["academic-years", params],
    queryFn: () => academicYearService.getAll(params),
  });
};

export const useAcademicYear = (id: string | null) => {
  return useQuery({
    queryKey: ["academic-year", id],
    queryFn: () => academicYearService.getById(id!),
    enabled: !!id,
  });
};

export const useCurrentAcademicYear = () => {
  return useQuery({
    queryKey: ["current-academic-year"],
    queryFn: () => academicYearService.getCurrent(),
  });
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAcademicYearRequest) => academicYearService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
    },
  });
};

export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcademicYearRequest }) =>
      academicYearService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["current-academic-year"] });
    },
  });
};

export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => academicYearService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["current-academic-year"] });
    },
  });
};

export const useSetCurrentAcademicYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => academicYearService.setCurrent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["academic-years"] });
      queryClient.invalidateQueries({ queryKey: ["academic-year", id] });
      queryClient.invalidateQueries({ queryKey: ["current-academic-year"] });
    },
  });
};
