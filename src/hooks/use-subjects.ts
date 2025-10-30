"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "@/services/subject";
import { CreateSubjectInput, UpdateSubjectInput, SubjectFilters } from "@/types/subject";
import { toast } from "sonner";

const QUERY_KEY = "subjects";

export const useSubjects = (filters?: SubjectFilters) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => subjectService.getAll(filters),
    staleTime: 30000, // 30 seconds
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSubjectInput) => subjectService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });
      toast.success(response.message || "Subject created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create subject";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubjectInput }) => 
      subjectService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });
      toast.success(response.message || "Subject updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update subject";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => subjectService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });
      toast.success(response.message || "Subject deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete subject";
      toast.error(message);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => subjectService.bulkDelete(ids),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });
      if (response.errors && response.errors.length > 0) {
        toast.warning(`${response.message}\n${response.errors.join('\n')}`);
      } else {
        toast.success(response.message);
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete subjects";
      toast.error(message);
    },
  });

  return {
    subjects: data?.data || [],
    meta: data?.meta,
    total: data?.total || data?.meta?.total || 0,
    isLoading,
    error,
    refetch,
    createSubject: createMutation.mutateAsync,
    updateSubject: updateMutation.mutateAsync,
    deleteSubject: deleteMutation.mutateAsync,
    bulkDelete: bulkDeleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkDeleting: bulkDeleteMutation.isPending,
  };
};

export const useSubjectStatistics = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [`${QUERY_KEY}-statistics`],
    queryFn: () => subjectService.getStatistics(),
    staleTime: 60000, // 1 minute
  });

  return {
    statistics: data?.data,
    isLoading,
    error,
  };
};

export const useSubjectById = (id: number | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => subjectService.getById(id!),
    enabled: !!id,
  });

  return {
    subject: data?.data,
    isLoading,
    error,
  };
};
