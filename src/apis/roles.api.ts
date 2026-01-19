import { RESOURCE } from "@/configs/api-config";
import { COLUMN_SORT, DIRECTION_SORT, PER_PAGE } from "@/constants/constants";
import type { ColumnSearchItem } from "@/hooks/useCrudManagement";
import type { IRoles } from "@/interfaces/roles.interface";
import axiosInstance from "@/utils/axios";
import type { ApiResponse } from "./auth.api";
import type { PaginatedResponse } from "./user.api";

export const rolesApi = {
  getDefaultPermissions: async () => {
    const response = await axiosInstance.post<ApiResponse<IRoles>>(`${RESOURCE.ROLES}/default-permission`);
    return response.data;
  },
  getRolesList: async (
    page: number = 1,
    limit: number = PER_PAGE,
    f?: ColumnSearchItem[],
    column_sort: string = COLUMN_SORT,
    direction_sort: string = DIRECTION_SORT
  ) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<IRoles>>>(RESOURCE.ROLES, {
      params: { page, limit, column_sort, direction_sort, f }
    });
    return response.data;
  },
  getRolesById: async (id: string | number) => {
    const response = await axiosInstance.get<ApiResponse<IRoles>>(`${RESOURCE.ROLES}/${id}`);
    return response.data;
  },
  createRoles: async (roles: Partial<IRoles>) => {
    const response = await axiosInstance.post<ApiResponse<IRoles>>(`${RESOURCE.ROLES}`, roles);
    return response.data;
  },
  updateRoles: async (id: string | number, roles: Partial<IRoles>) => {
    const response = await axiosInstance.patch<ApiResponse<IRoles>>(`${RESOURCE.ROLES}/${id}`, roles);
    return response.data;
  },
  deleteRoles: async (id: string | number) => {
    const response = await axiosInstance.delete<ApiResponse<IRoles>>(`${RESOURCE.ROLES}/${id}`);
    return response.data;
  }
};
