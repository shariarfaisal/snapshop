import { useQuery } from "@tanstack/react-query";
import { teacherClassesService, TeacherClass } from "@/services/teacherClasses";

export const useTeacherClasses = () => {
  return useQuery({
    queryKey: ["teacher-classes"],
    queryFn: () => teacherClassesService.getMyClasses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTeacherClassesById = (teacherId: number) => {
  return useQuery({
    queryKey: ["teacher-classes", teacherId],
    queryFn: () => teacherClassesService.getTeacherClasses(teacherId),
    staleTime: 1000 * 60 * 5,
  });
};
