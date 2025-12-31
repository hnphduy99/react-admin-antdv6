import { RESOURCE } from "@/configs/api-config";
import axiosInstance from "@/utils/axios";

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
  status: boolean;
}

export const authApi = {
  login: async (tai_khoan: string, mat_khau: string): Promise<ApiResponse> => {
    const response = await axiosInstance.post(RESOURCE.LOGIN, { tai_khoan, mat_khau });
    return response.data;
  },
  logout: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.post(RESOURCE.LOGOUT);
    return response.data;
  }
};
