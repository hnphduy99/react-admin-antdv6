import { profileApi } from "@/apis/profile.api";
import type { IUser } from "@/interfaces/user.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

/**
 * Hook lấy thông tin profile hiện tại
 */
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileApi.getProfile(),
    select: (response) => (response.code === 200 ? response.data : null),
    staleTime: 1000 * 60 * 5 // 5 phút
  });
};

/**
 * Hook cập nhật profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IUser) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
    }
  });
};

/**
 * Hook đổi mật khẩu
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      mat_khau_hien_tai,
      mat_khau_moi,
      mat_khau_moi_xac_nhan
    }: {
      mat_khau_hien_tai: string;
      mat_khau_moi: string;
      mat_khau_moi_xac_nhan: string;
    }) => profileApi.changePassword(mat_khau_hien_tai, mat_khau_moi, mat_khau_moi_xac_nhan)
  });
};

/**
 * Hook cập nhật avatar
 */
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => profileApi.updateAvatar(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
    }
  });
};
