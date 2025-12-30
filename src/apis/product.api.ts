import { COLUMN_SORT, DIRECTION_SORT, PER_PAGE } from "@/constants/constants";
import type { IProduct } from "@/interfaces/product.interface";
import axiosInstance from "@/utils/axios";
import type { ApiResponse } from "./auth.api";
import type { ColumnSearchItem } from "@/hooks/useCrudManagement";
import type { PaginatedResponse } from "./user.api";

export const productApi = {
  getProductList: async (
    page: number = 1,
    limit: number = PER_PAGE,
    f?: ColumnSearchItem[],
    column_sort: string = COLUMN_SORT,
    direction_sort: string = DIRECTION_SORT
  ) => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<IProduct>>>("/products", {
      params: { page, limit, column_sort, direction_sort, f }
    });
    return response.data;
  },
  getProductById: async (id: string | number) => {
    const response = await axiosInstance.get<ApiResponse<IProduct>>(`/products/${id}`);
    return response.data;
  },
  createProduct: async (product: Partial<IProduct>) => {
    const response = await axiosInstance.post<ApiResponse<IProduct>>("/products", product);
    return response.data;
  },
  updateProduct: async (id: string | number, product: Partial<IProduct>) => {
    const response = await axiosInstance.patch<ApiResponse<IProduct>>(`/products/${id}`, product);
    return response.data;
  },
  deleteProduct: async (id: string | number) => {
    const response = await axiosInstance.delete<ApiResponse<IProduct>>(`/products/${id}`);
    return response.data;
  }
};
