"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { classSubjectService } from "@/services/subject";
import { CreateClassSubjectInput, UpdateClassSubjectInput, CreateClassSubjectDirectInput } from "@/types/subject";
import { toast } from "sonner";

const QUERY_KEY = "class-subjects";

export const useClassSubjects = (classId: number | null) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, classId],
    queryFn: () => classSubjectService.getByClass(classId!),
    enabled: !!classId,
  });

  return {
    subjects: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

export const useAddClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: { classId: number; data: CreateClassSubjectInput }) =>
      classSubjectService.addToClass(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.classId] });
      toast.success("Subject added to class successfully");
    },
    onError: () => {
      toast.error("Failed to add subject to class");
    },
  });
};

export const useCreateAndAssignClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: { classId: number; data: CreateClassSubjectDirectInput }) =>
      classSubjectService.createAndAssignToClass(classId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.classId] });
      toast.success("Subject created and assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create and assign subject");
    },
  });
};

export const useBulkAddClassSubjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, subjects }: { classId: number; subjects: CreateClassSubjectInput[] }) =>
      classSubjectService.bulkAddToClass(classId, { subjects }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.classId] });
      toast.success("Subjects added to class successfully");
    },
    onError: () => {
      toast.error("Failed to add subjects to class");
    },
  });
};

export const useUpdateClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, classSubjectId, data }: { classId: number; classSubjectId: number; data: UpdateClassSubjectInput }) =>
      classSubjectService.updateInClass(classId, classSubjectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.classId] });
      toast.success("Class subject updated successfully");
    },
    onError: () => {
      toast.error("Failed to update class subject");
    },
  });
};

export const useRemoveClassSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, classSubjectId }: { classId: number; classSubjectId: number }) =>
      classSubjectService.removeFromClass(classId, classSubjectId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.classId] });
      toast.success("Subject removed from class successfully");
    },
    onError: () => {
      toast.error("Failed to remove subject from class");
    },
  });
};

export const useBulkRemoveClassSubjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, ids }: { classId: number; ids: number[] }) =>
      classSubjectService.bulkRemoveFromClass(classId, ids),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, variables.classId] });
      toast.success("Subjects removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove subjects");
    },
  });
};
