import { COLUMN_SORT, DIRECTION_SORT, PER_PAGE } from "@/constants/constants";
import type { IUser } from "@/interfaces/user.interface";
import axiosInstance from "@/utils/axios";
import type { ApiResponse } from "./auth.api";

export interface PaginatedResponse<T> {
  collection: T[];
  total: number;
  total_current: number;
  from: number;
  to: number;
  current_page: number;
  next_page: number;
  last_page: number;
}

export const userApi = {
  getUserList: async (
    page: number = 1,
    pageSize: number = PER_PAGE,
    search?: string,
    colSearches: Record<string, string> = {},
    columnSort: string = COLUMN_SORT,
    directionSort: string = DIRECTION_SORT
  ) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<IUser>>>("/users", {
      params: { page, pageSize, columnSort, directionSort, search, colSearches }
    });
    return response.data;
  },
  getUserById: async (id: string | number) => {
    const response = await axiosInstance.get<ApiResponse<IUser>>(`/users/${id}`);
    return response.data;
  },
  createUser: async (user: IUser) => {
    const response = await axiosInstance.post<ApiResponse<IUser>>("/users", user);
    return response.data;
  },
  updateUser: async (id: string | number, user: IUser) => {
    const response = await axiosInstance.patch<ApiResponse<IUser>>(`/users/${id}`, user);
    return response.data;
  },
  deleteUser: async (id: string | number) => {
    const response = await axiosInstance.delete<ApiResponse<IUser>>(`/users/${id}`);
    return response.data;
  }
};
