import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "@/services/teacher";
import type { TeacherFormData, TeacherFilters } from "@/types/teacher";

export const useTeachers = (filters?: TeacherFilters) => {
  return useQuery({
    queryKey: ["teachers", filters],
    queryFn: () => teacherService.getTeachers(filters),
  });
};

export const useTeacher = (id: number | null) => {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => teacherService.getTeacher(id!),
    enabled: !!id,
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TeacherFormData) => teacherService.createTeacher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TeacherFormData> }) =>
      teacherService.updateTeacher(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", variables.id] });
    },
  });
};

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teacherService.deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

export const useTeacherClasses = (id: number | null) => {
  return useQuery({
    queryKey: ["teacher-classes", id],
    queryFn: () => teacherService.getTeacherClasses(id!),
    enabled: !!id,
  });
};

export const useTeacherSubjects = (id: number | null) => {
  return useQuery({
    queryKey: ["teacher-subjects", id],
    queryFn: () => teacherService.getTeacherSubjects(id!),
    enabled: !!id,
  });
};

export const useTeacherTimetable = (id: number | null) => {
  return useQuery({
    queryKey: ["teacher-timetable", id],
    queryFn: () => teacherService.getTeacherTimetable(id!),
    enabled: !!id,
  });
};

export const useTeacherLessonPlans = (id: number | null) => {
  return useQuery({
    queryKey: ["teacher-lesson-plans", id],
    queryFn: () => teacherService.getTeacherLessonPlans(id!),
    enabled: !!id,
  });
};

export const useDepartments = (filters?: { status?: string; per_page?: string }) => {
  return useQuery({
    queryKey: ["departments", filters],
    queryFn: () => teacherService.getDepartments(filters),
  });
};

export const useDesignations = (filters?: {
  status?: string;
  department_id?: number;
  per_page?: string;
}) => {
  return useQuery({
    queryKey: ["designations", filters],
    queryFn: () => teacherService.getDesignations(filters),
  });
};

export const useExportTeachers = () => {
  return useMutation({
    mutationFn: (filters?: TeacherFilters) => teacherService.exportTeachers(filters),
  });
};

export const useBulkImportTeachers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => teacherService.bulkImportTeachers(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};
