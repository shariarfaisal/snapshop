import { useQuery } from "@tanstack/react-query";
import { teacherDashboardService, TeacherDashboardResponse } from "@/services/teacherDashboard";

export const useTeacherDashboard = () => {
  return useQuery({
    queryKey: ["teacher-dashboard"],
    queryFn: () => teacherDashboardService.getDashboard(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
