import axiosInstance from "@/utils/axios";
import type { ApiResponse } from "./auth.api";
import { RESOURCE } from "@/configs/api-config";

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface RecentActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  type: string;
}

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await axiosInstance.get(`${RESOURCE.DASHBOARD}/stats`);
    return response.data;
  },
  getRecentActivities: async (limit: number = 10): Promise<ApiResponse<RecentActivity[]>> => {
    const response = await axiosInstance.get(`${RESOURCE.DASHBOARD}/activities`, { params: { limit } });
    return response.data;
  }
};
