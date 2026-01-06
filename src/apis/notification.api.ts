import axiosInstance from "@/utils/axios";
import type { ApiResponse } from "./auth.api";
import type { Notification } from "@/types";

export const notificationApi = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    const response = await axiosInstance.get(RESOURCE_NOTIFICATIONS); // I'll define this or use a string
    return response.data;
  },
  markAsRead: async (id: string): Promise<ApiResponse> => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.patch("/notifications/read-all");
    return response.data;
  }
};

const RESOURCE_NOTIFICATIONS = "/notifications";
