import type { IUser } from "@/interfaces/user.interface";
import type { ApiResponse } from "./auth.api";
import axiosInstance from "@/utils/axios";
import { RESOURCE } from "@/configs/api-config";

export const profileApi = {
  getProfile: async () => {
    const response = await axiosInstance.get<ApiResponse<IUser>>(RESOURCE.PROFILE);
    return response.data;
  },
  updateProfile: async (data: IUser) => {
    const response = await axiosInstance.patch<ApiResponse<IUser>>(RESOURCE.PROFILE, data);
    return response.data;
  },
  updateAvatar: async (formData: FormData) => {
    const response = await axiosInstance.patch<ApiResponse<IUser>>(`${RESOURCE.PROFILE}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }
};
