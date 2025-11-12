import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherMarksService, Mark, MarksFilters, Exam, Subject } from "@/services/teacherMarks";

export const useTeacherMarks = (filters?: MarksFilters) => {
  return useQuery({
    queryKey: ["teacher-marks", filters],
    queryFn: () => teacherMarksService.getMarks(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: () => teacherMarksService.getExams(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => teacherMarksService.getSubjects(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useSaveMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => teacherMarksService.saveMark(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-marks"] });
    },
  });
};

export const useUpdateMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      teacherMarksService.updateMark(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-marks"] });
    },
  });
};

export const useBulkImportMarks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, examId }: { file: File; examId: number }) =>
      teacherMarksService.bulkImportMarks(file, examId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-marks"] });
    },
  });
};

export const useDeleteMark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => teacherMarksService.deleteMark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-marks"] });
    },
  });
};
