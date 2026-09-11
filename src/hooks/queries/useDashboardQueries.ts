import { dashboardApi } from "@/apis/dashboard.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

/**
 * Hook lấy dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardApi.getStats(),
    select: (response) => (response.status ? response.data : null),
    staleTime: 1000 * 60 * 5 // 5 phút
  });
};

/**
 * Hook lấy recent activities
 */
export const useDashboardActivities = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.dashboard.activities(limit),
    queryFn: () => dashboardApi.getRecentActivities(limit),
    select: (response) => (response.status ? response.data : []),
    staleTime: 1000 * 60 * 2 // 2 phút
  });
};
