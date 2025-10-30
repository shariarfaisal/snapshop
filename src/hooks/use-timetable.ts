"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { timetableService } from "@/services/timetable";
import {
  CreateTimetableInput,
  UpdateTimetableInput,
  TimetableFilters,
  BulkTimetableEntry,
  DayOfWeek,
} from "@/types/timetable";
import { toast } from "sonner";

const QUERY_KEY = "timetables";

/**
 * Hook to fetch all timetable entries with filters
 */
export const useTimetables = (filters?: TimetableFilters) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: () => timetableService.getAll(filters),
    staleTime: 30000, // 30 seconds
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTimetableInput) => timetableService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });
      toast.success(response.message || "Timetable entry created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create timetable entry";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTimetableInput }) =>
      timetableService.update(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });
      toast.success(response.message || "Timetable entry updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to update timetable entry";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => timetableService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });
      toast.success(response.message || "Timetable entry deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete timetable entry";
      toast.error(message);
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: (entries: BulkTimetableEntry[]) => timetableService.bulkCreate(entries),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [`${QUERY_KEY}-statistics`] });

      if (response.data.failed > 0) {
        toast.warning(
          `${response.data.created} entries created, ${response.data.failed} failed`
        );
      } else {
        toast.success(response.message || "All timetable entries created successfully");
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to create timetable entries";
      toast.error(message);
    },
  });

  return {
    timetables: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    refetch,
    createTimetable: createMutation.mutateAsync,
    updateTimetable: updateMutation.mutateAsync,
    deleteTimetable: deleteMutation.mutateAsync,
    bulkCreateTimetable: bulkCreateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isBulkCreating: bulkCreateMutation.isPending,
  };
};

/**
 * Hook to fetch timetable for a specific class and section
 */
export const useTimetableByClass = (
  classId: number | null,
  sectionId: number | null,
  academicYearId?: number
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, "class", classId, sectionId, academicYearId],
    queryFn: () => timetableService.getByClass(classId!, sectionId!, academicYearId),
    enabled: !!classId && !!sectionId,
    staleTime: 30000,
  });

  return {
    timetable: data?.data,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch timetable for a specific teacher
 */
export const useTimetableByTeacher = (teacherId: number | null, academicYearId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, "teacher", teacherId, academicYearId],
    queryFn: () => timetableService.getByTeacher(teacherId!, academicYearId),
    enabled: !!teacherId,
    staleTime: 30000,
  });

  return {
    timetable: data?.data,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to fetch timetable for a specific room
 */
export const useTimetableByRoom = (roomNumber: string | null, academicYearId?: number) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QUERY_KEY, "room", roomNumber, academicYearId],
    queryFn: () => timetableService.getByRoom(roomNumber!, academicYearId),
    enabled: !!roomNumber,
    staleTime: 30000,
  });

  return {
    timetable: data?.data,
    isLoading,
    error,
    refetch,
  };
};

/**
 * Hook to get timetable statistics
 */
export const useTimetableStatistics = (academicYearId?: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [`${QUERY_KEY}-statistics`, academicYearId],
    queryFn: () => timetableService.getStatistics(academicYearId),
    staleTime: 60000, // 1 minute
  });

  return {
    statistics: data?.data,
    isLoading,
    error,
  };
};

/**
 * Hook to get a single timetable entry by ID
 */
export const useTimetableById = (id: number | null) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => timetableService.getById(id!),
    enabled: !!id,
  });

  return {
    timetable: data?.data,
    isLoading,
    error,
  };
};

/**
 * Hook to check for timetable conflicts
 */
export const useCheckConflicts = () => {
  const checkConflictsMutation = useMutation({
    mutationFn: (data: CreateTimetableInput & { exclude_id?: number }) =>
      timetableService.checkConflicts(data),
  });

  return {
    checkConflicts: checkConflictsMutation.mutateAsync,
    isChecking: checkConflictsMutation.isPending,
    conflicts: checkConflictsMutation.data?.data,
  };
};
