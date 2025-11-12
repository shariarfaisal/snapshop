import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  teacherAttendanceService,
  AttendanceRecord,
  AttendanceFilters,
} from "@/services/teacherAttendance";

export const useTeacherAttendance = (filters?: AttendanceFilters) => {
  return useQuery({
    queryKey: ["teacher-attendance", filters],
    queryFn: () => teacherAttendanceService.getAttendance(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => teacherAttendanceService.markAttendance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance"] });
    },
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      teacherAttendanceService.updateAttendance(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance"] });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teacherAttendanceService.deleteAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-attendance"] });
    },
  });
};
