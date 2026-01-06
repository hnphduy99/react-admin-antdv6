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
  },
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const response = await axiosInstance.post(RESOURCE.FORGOTPASS, { email });
    return response.data;
  },
  resetPassword: async (token: string, mat_khau: string): Promise<ApiResponse> => {
    const response = await axiosInstance.post(RESOURCE.RESET, { token, mat_khau });
    return response.data;
  },
  register: async (name: string, email: string, mat_khau: string): Promise<ApiResponse> => {
    const response = await axiosInstance.post("/auth/register", { name, email, mat_khau });
    return response.data;
  }
};
