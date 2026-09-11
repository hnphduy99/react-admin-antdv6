import { productApi } from "@/apis/product.api";
import type { ColumnSearchItem } from "@/hooks/useCrudManagement";
import type { IProduct } from "@/interfaces/product.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export interface ProductListParams {
  page?: number;
  limit?: number;
  columnSearches?: ColumnSearchItem[];
}

/**
 * Hook lấy danh sách products (có pagination + filters)
 */
export const useProductList = (params: ProductListParams = {}) => {
  const { page = 1, limit = 10, columnSearches = [] } = params;

  return useQuery({
    queryKey: queryKeys.products.list({ page, limit, columnSearches }),
    queryFn: () => productApi.getProductList(page, limit, columnSearches),
    select: (response) => response
  });
};

/**
 * Hook lấy product theo ID
 */
export const useProductById = (id: string | number | undefined) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id!),
    queryFn: () => productApi.getProductById(id!),
    enabled: !!id,
    select: (response) => (response.code === 200 ? response.data : null)
  });
};

/**
 * Hook tạo mới product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Partial<IProduct>) => productApi.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    }
  });
};

/**
 * Hook cập nhật product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string | number; product: Partial<IProduct> }) =>
      productApi.updateProduct(id, product),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
    }
  });
};

/**
 * Hook xóa product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    }
  });
};
