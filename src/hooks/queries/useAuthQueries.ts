import { authApi } from "@/apis/auth.api";
import { login as loginAction } from "@/store/slices/authSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { queryKeys } from "./queryKeys";

/**
 * Hook cho Login mutation
 * Tự động dispatch Redux action và invalidate relevant queries
 */
export const useLoginMutation = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tai_khoan, mat_khau }: { tai_khoan: string; mat_khau: string }) =>
      authApi.login(tai_khoan, mat_khau),
    onSuccess: (response) => {
      if (response.code === 200) {
        dispatch(loginAction(response.data));
        // Invalidate toàn bộ cache khi login thành công
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() });
      }
    }
  });
};

/**
 * Hook cho Logout mutation
 */
export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Xóa toàn bộ cache khi logout
      queryClient.clear();
    }
  });
};

/**
 * Hook cho ForgotPassword mutation
 */
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email)
  });
};

/**
 * Hook cho ResetPassword mutation
 */
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ token, mat_khau }: { token: string; mat_khau: string }) => authApi.resetPassword(token, mat_khau)
  });
};

/**
 * Hook cho Register mutation
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: ({ name, email, mat_khau }: { name: string; email: string; mat_khau: string }) =>
      authApi.register(name, email, mat_khau)
  });
};
