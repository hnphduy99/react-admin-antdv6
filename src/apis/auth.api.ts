import axiosInstance from "@/utils/axios";

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
  status: boolean;
}

export const authApi = {
  login: async (tai_khoan: string, mat_khau: string): Promise<ApiResponse> => {
    const response = await axiosInstance.post("/auth/login", { tai_khoan, mat_khau });
    return response.data;
  },
  logout: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  }
};
