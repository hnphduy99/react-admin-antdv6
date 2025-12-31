import { COLUMN_SORT, DIRECTION_SORT, PER_PAGE } from "@/constants/constants";
import type { I[ComponentName] } from "@/interfaces/[componentName].interface";
import axiosInstance from "@/utils/axios";
import type { ApiResponse } from "./auth.api";
import type { ColumnSearchItem } from "@/hooks/useCrudManagement";
import type { PaginatedResponse } from "./user.api";
import { RESOURCE } from "@/configs/api-config";

export const [componentName]Api = {
  get[ComponentName]List: async (
    page: number = 1,
    limit: number = PER_PAGE,
    f?: ColumnSearchItem[],
    column_sort: string = COLUMN_SORT,
    direction_sort: string = DIRECTION_SORT
  ) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<I[ComponentName]>>>(RESOURCE.[COMPONENT_NAME], {
      params: { page, limit, column_sort, direction_sort, f }
    });
    return response.data;
  },
  get[ComponentName]ById: async (id: string | number) => {
    const response = await axiosInstance.get<ApiResponse<I[ComponentName]>>(`${RESOURCE.[COMPONENT_NAME]}/${id}`);
    return response.data;
  },
  create[ComponentName]: async ([componentName]: Partial<I[ComponentName]>) => {
    const response = await axiosInstance.post<ApiResponse<I[ComponentName]>>(`${RESOURCE.[COMPONENT_NAME]}`, [componentName]);
    return response.data;
  },
  update[ComponentName]: async (id: string | number, [componentName]: Partial<I[ComponentName]>) => {
    const response = await axiosInstance.patch<ApiResponse<I[ComponentName]>>(`${RESOURCE.[COMPONENT_NAME]}/${id}`, [componentName]);
    return response.data;
  },
  delete[ComponentName]: async (id: string | number) => {
    const response = await axiosInstance.delete<ApiResponse<I[ComponentName]>>(`${RESOURCE.[COMPONENT_NAME]}/${id}`);
    return response.data;
  }
};
