import { teacherService } from "@/services/teacher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Teachers list
export const useTeachers = (filters?: any, page: number = 1) => {
  return useQuery({
    queryKey: ["teachers", filters, page],
    queryFn: () => teacherService.getAll(filters, page),
  });
};

// Single teacher
export const useTeacherById = (id: number) => {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: () => teacherService.getById(id),
    enabled: !!id,
  });
};

// Available users for teacher assignment
export const useAvailableUsers = (search?: string) => {
  return useQuery({
    queryKey: ["available-users", search],
    queryFn: () => teacherService.getAvailableUsers(search),
  });
};

// Create teacher
export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => teacherService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

// Update teacher
export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      teacherService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", variables.id] });
    },
  });
};

// Delete teacher
export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => teacherService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};

// Get teacher classes
export const useTeacherClasses = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacher-classes", teacherId],
    queryFn: () => teacherService.getClasses(teacherId),
    enabled: !!teacherId,
  });
};

// Get teacher subjects
export const useTeacherSubjects = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacher-subjects", teacherId],
    queryFn: () => teacherService.getSubjects(teacherId),
    enabled: !!teacherId,
  });
};
