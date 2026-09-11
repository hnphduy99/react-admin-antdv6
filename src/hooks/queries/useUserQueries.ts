import { userApi } from "@/apis/user.api";
import type { ColumnSearchItem } from "@/hooks/useCrudManagement";
import type { IUser } from "@/interfaces/user.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export interface UserListParams {
  page?: number;
  limit?: number;
  columnSearches?: ColumnSearchItem[];
}

/**
 * Hook lấy danh sách users (có pagination + filters)
 */
export const useUserList = (params: UserListParams = {}) => {
  const { page = 1, limit = 10, columnSearches = [] } = params;

  return useQuery({
    queryKey: queryKeys.users.list({ page, limit, columnSearches }),
    queryFn: () => userApi.getUserList(page, limit, columnSearches),
    select: (response) => response
  });
};

/**
 * Hook lấy user theo ID
 */
export const useUserById = (id: string | number | undefined) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userApi.getUserById(id!),
    enabled: !!id,
    select: (response) => (response.code === 200 ? response.data : null)
  });
};

/**
 * Hook tạo mới user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: IUser) => userApi.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    }
  });
};

/**
 * Hook cập nhật user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, user }: { id: string | number; user: IUser }) => userApi.updateUser(id, user),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
    }
  });
};

/**
 * Hook xóa user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => userApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
    }
  });
};
