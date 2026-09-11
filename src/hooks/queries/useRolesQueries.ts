import { rolesApi } from "@/apis/roles.api";
import type { ColumnSearchItem } from "@/hooks/useCrudManagement";
import type { IRoles } from "@/interfaces/roles.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export interface RolesListParams {
  page?: number;
  limit?: number;
  columnSearches?: ColumnSearchItem[];
}

/**
 * Hook lấy danh sách roles (có pagination + filters)
 */
export const useRolesList = (params: RolesListParams = {}) => {
  const { page = 1, limit = 10, columnSearches = [] } = params;

  return useQuery({
    queryKey: queryKeys.roles.list({ page, limit, columnSearches }),
    queryFn: () => rolesApi.getRolesList(page, limit, columnSearches),
    select: (response) => response
  });
};

/**
 * Hook lấy roles theo ID
 */
export const useRolesById = (id: string | number | undefined) => {
  return useQuery({
    queryKey: queryKeys.roles.detail(id!),
    queryFn: () => rolesApi.getRolesById(id!),
    enabled: !!id,
    select: (response) => (response.code === 200 ? response.data : null)
  });
};

/**
 * Hook lấy default permissions
 */
export const useDefaultPermissions = () => {
  return useQuery({
    queryKey: queryKeys.roles.defaultPermissions(),
    queryFn: () => rolesApi.getDefaultPermissions(),
    staleTime: 1000 * 60 * 10 // 10 phút — permissions ít thay đổi
  });
};

/**
 * Hook lấy roles options (cho Select dropdown)
 */
export const useRolesOptions = () => {
  return useQuery({
    queryKey: queryKeys.roles.options(),
    queryFn: async () => {
      const response = await rolesApi.getRolesList(1, 9999);
      if (response.code === 200) {
        return response.data.collection.map((role) => ({
          value: role.id,
          label: (role as any).ten_vai_tro || (role as any).name || String(role.id)
        }));
      }
      return [];
    },
    staleTime: 1000 * 60 * 5
  });
};

/**
 * Hook tạo mới roles
 */
export const useCreateRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roles: Partial<IRoles>) => rolesApi.createRoles(roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.options() });
    }
  });
};

/**
 * Hook cập nhật roles
 */
export const useUpdateRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roles }: { id: string | number; roles: Partial<IRoles> }) => rolesApi.updateRoles(id, roles),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.options() });
    }
  });
};

/**
 * Hook xóa roles
 */
export const useDeleteRoles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => rolesApi.deleteRoles(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.options() });
    }
  });
};
