import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/api/dashboard";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => dashboardService.getAdminDashboard(),
  });
};
