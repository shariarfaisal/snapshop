"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "@/services/subject";
import { CreateSubjectInput, UpdateSubjectInput } from "@/types/program";

export interface UseSubjectProps {
    page: number;
    limit: number;
    search?: string;
    programId?: string;
}

export const useSubject = (params?: UseSubjectProps) => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
      queryKey: [subjectService.getAllSubjects.name, params || {}],
      queryFn: () => subjectService.getAllSubjects(params),
      enabled: !!params,
      select: (data) => data || { data: [], total: 0 },
    });

    const searchSubject = useMutation({
        mutationKey: [subjectService.getAllSubjects.name],
        mutationFn: subjectService.getAllSubjects,
        onError: (error) => {
            console.error("Error searching subjects:", error);
            return { data: [], total: 0 };
        }
    });

    const createSubject = useMutation({
        mutationKey: [subjectService.createSubject.name],
        mutationFn: (data: CreateSubjectInput) => subjectService.createSubject(data),
    });

    const updateSubject = useMutation({
        mutationKey: [subjectService.updateSubject.name],
        mutationFn: ({ id, data }: { id: string, data: UpdateSubjectInput }) => subjectService.updateSubject(id, data),
    });

    const deleteSubject = useMutation({
        mutationKey: [subjectService.deleteSubject.name],
        mutationFn: (id: string) => subjectService.deleteSubject(id),
    });

    const getSubjectById = useMutation({
        mutationKey: [subjectService.getSubjectById.name],
        mutationFn: (id: string) => subjectService.getSubjectById(id),
    });
    
    const invalidateSubjects = () => {
        queryClient.invalidateQueries({ queryKey: [subjectService.getAllSubjects.name] });
    }

    return {
        data,
        isLoading,
        error,
        createSubject,
        updateSubject,
        deleteSubject,
        getSubjectById,
        invalidateSubjects,
        searchSubject,
    };
};
