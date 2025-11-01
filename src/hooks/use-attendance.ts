import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "@/services/api/attendance";
import type {
  AttendanceFilters,
  MarkAttendanceRequest,
  BulkAttendanceRequest,
} from "@/types/attendance";

export const useAttendance = (filters?: AttendanceFilters, page: number = 1) => {
  return useQuery({
    queryKey: ["attendance", filters, page],
    queryFn: () => attendanceService.getAll(filters, page),
  });
};

export const useMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MarkAttendanceRequest) => attendanceService.mark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-statistics"] });
    },
  });
};

export const useBulkMarkAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkAttendanceRequest) => attendanceService.bulk(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-statistics"] });
    },
  });
};

export const useStudentAttendance = (studentId: number | null, filters?: Partial<AttendanceFilters>) => {
  return useQuery({
    queryKey: ["student-attendance", studentId, filters],
    queryFn: () => attendanceService.getStudentAttendance(studentId!, filters),
    enabled: !!studentId,
  });
};

export const useClassAttendanceByDate = (classId: number | null, date: string | null) => {
  return useQuery({
    queryKey: ["class-attendance-by-date", classId, date],
    queryFn: () => attendanceService.getClassAttendanceByDate(classId!, date!),
    enabled: !!classId && !!date,
  });
};

export const useAttendanceStatistics = (filters?: Partial<AttendanceFilters>) => {
  return useQuery({
    queryKey: ["attendance-statistics", filters],
    queryFn: () => attendanceService.getStatistics(filters),
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MarkAttendanceRequest> }) =>
      attendanceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-statistics"] });
    },
  });
};

export const useExportAttendance = () => {
  return useMutation({
    mutationFn: (filters?: Partial<AttendanceFilters>) => attendanceService.export(filters),
  });
};
