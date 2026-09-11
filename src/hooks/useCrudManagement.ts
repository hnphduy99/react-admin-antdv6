import type { ApiResponse } from "@/apis/auth.api";
import type { PaginatedResponse } from "@/apis/user.api";
import { PER_PAGE } from "@/constants/constants";
import type { ColumnSearchValue } from "@/interfaces/searchTable.interface";
import { useNotification } from "@/providers/NotificationProvider";
import type { SearchOperator } from "@/types/searchOperator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form } from "antd";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface ColumnSearchItem {
  field: string;
  value: string | number;
  operator: SearchOperator;
}

interface CrudApiService<T> {
  getAll?: (
    page: number,
    limit: number,
    columnSearches?: ColumnSearchItem[]
  ) => Promise<ApiResponse<PaginatedResponse<T>>>;
  getById?: (id: string | number) => Promise<ApiResponse<T>>;
  create?: (data: T) => Promise<ApiResponse<T>>;
  update?: (id: string | number, data: T) => Promise<ApiResponse<T>>;
  delete?: (id: string | number) => Promise<ApiResponse<T>>;
}

interface CrudConfig<T> {
  apiService: CrudApiService<T>;
  entityName: string;
  onView?: (item: T) => void;
  mode?: "modal" | "page";
  basePath?: string;
}

export interface PaginationConfig {
  current: number;
  limit: number;
  total: number;
}

/**
 * Generic CRUD Hook (powered by TanStack Query)
 * Reusable hook for all CRUD operations (Create, Read, Update, Delete)
 * Interface trả về giữ nguyên để không cần thay đổi các page components.
 *
 * @example
 * const userCrud = useCrudManagement({
 *   apiService: mockApi.user,
 *   entityName: "User",
 *   mode: "page",
 *   basePath: "/users"
 * });
 */
export const useCrudManagement = <T extends { id: string | number }>(config: CrudConfig<T>) => {
  const [columnSearches, setColumnSearches] = useState<ColumnSearchItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    limit: PER_PAGE,
    total: 0
  });

  const [form] = Form.useForm();
  const notification = useNotification();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { apiService, entityName, onView, mode, basePath } = useMemo(
    () => ({
      apiService: config.apiService,
      entityName: config.entityName,
      onView: config.onView,
      mode: config.mode || "modal",
      basePath: config.basePath
    }),
    [config.apiService, config.entityName, config.onView, config.mode, config.basePath]
  );

  const { current, limit } = pagination;
  // Unique query key dựa trên entityName + params
  const listQueryKey = useMemo(
    () => [entityName, "list", { page: current, limit, columnSearches }],
    [entityName, current, limit, columnSearches]
  );

  //useQuery: fetch danh sách
  const {
    data: queryData,
    isFetching: isFetchingList,
    refetch: refetchList
  } = useQuery({
    queryKey: listQueryKey,
    queryFn: () => {
      if (!apiService.getAll) return null;
      return apiService.getAll(pagination.current, pagination.limit, columnSearches);
    },
    enabled: !!apiService.getAll,
    select: (response) => {
      if (!response) return { collection: [], total: 0, current_page: 1 };
      if (response.code === 200) {
        // Cập nhật pagination từ response
        return response.data;
      }
      return { collection: [], total: 0, current_page: 1 };
    }
  });

  // Đồng bộ pagination.total từ queryData
  const data: T[] = (queryData as any)?.collection ?? [];
  const totalFromServer: number = (queryData as any)?.total ?? 0;
  const currentPageFromServer: number = (queryData as any)?.current_page ?? 1;

  // Update pagination khi data thay đổi
  const paginationMerged: PaginationConfig = {
    current: currentPageFromServer || pagination.current,
    limit: pagination.limit,
    total: totalFromServer || pagination.total
  };

  // Helper để invalidate list query
  const invalidateList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [entityName, "list"] });
  }, [queryClient, entityName]);

  // Helper: fetch với params mới (thay đổi page/search)
  const fetchWithParams = useCallback((page: number, limit: number, colSearches: ColumnSearchItem[]) => {
    setPagination((prev) => ({ ...prev, current: page, limit }));
    setColumnSearches(colSearches);
    // useQuery sẽ tự re-fetch khi queryKey thay đổi
  }, []);

  // useMutation: Delete
  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => {
      if (!apiService.delete) throw new Error("Delete not supported");
      return apiService.delete(id);
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        notification.success({
          title: "Success",
          description: response.message || `${entityName} deleted successfully`
        });
        invalidateList();
      } else {
        notification.error({
          title: "Error",
          description: response.message || `Failed to delete ${entityName}`
        });
      }
    },
    onError: (error: any) => {
      notification.error({ title: "Error", description: error.message || `Failed to delete ${entityName}` });
    }
  });

  // useMutation: GetById
  const getByIdMutation = useMutation({
    mutationFn: (id: string | number) => {
      if (!apiService.getById) throw new Error("GetById not supported");
      return apiService.getById(id);
    },
    onSuccess: (response) => {
      if (response.code === 200) {
        setEditingItem(response.data);
        form.setFieldsValue(response.data);
        setIsModalOpen(true);
      }
    },
    onError: (error: any) => {
      notification.error({ title: "Error", description: error.message || `Failed to load ${entityName}` });
    }
  });

  // useMutation: Create
  const createMutation = useMutation({
    mutationFn: (data: T) => {
      if (!apiService.create) throw new Error("Create not supported");
      return apiService.create(data);
    }
  });

  // useMutation: Update
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: T }) => {
      if (!apiService.update) throw new Error("Update not supported");
      return apiService.update(id, data);
    }
  });

  // Handlers
  const applyColumnSearches = useCallback(
    (searches: Record<string, ColumnSearchValue | null>) => {
      let updatedSearches = [...columnSearches];

      Object.entries(searches).forEach(([column, value]) => {
        if (!value) {
          updatedSearches = updatedSearches.filter((item) => item.field !== column);
        } else {
          const existingIndex = updatedSearches.findIndex((item) => item.field === column);

          const newItem: ColumnSearchItem = {
            field: column,
            value: value.value,
            operator: value.operator
          };

          if (existingIndex >= 0) {
            updatedSearches[existingIndex] = newItem;
          } else {
            updatedSearches.push(newItem);
          }
        }
      });

      fetchWithParams(1, pagination.limit, updatedSearches);
    },
    [columnSearches, fetchWithParams, pagination.limit]
  );

  const handleColumnSearch = (value: ColumnSearchValue | null, column: string) => {
    applyColumnSearches({ [column]: value });
  };

  const handleBulkColumnSearch = (searches: Record<string, ColumnSearchValue | null>) => {
    applyColumnSearches(searches);
  };

  const handleTableChange = (newPagination: any, _filters: any, _sorter: any, extra: any) => {
    if (extra?.action === "paginate") {
      fetchWithParams(newPagination.current, newPagination.pageSize, columnSearches);
    }
  };

  const handleAdd = () => {
    if (mode === "page" && basePath) {
      navigate(`${basePath}/create`);
      return;
    }
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = async (id: string | number) => {
    if (mode === "page" && basePath) {
      navigate(`${basePath}/edit/${id}`);
      return;
    }
    getByIdMutation.mutate(id);
  };

  const handleDelete = async (id: string | number) => {
    if (!apiService.delete) return;
    deleteMutation.mutate(id);
  };

  // Handle modal submit (Create or Update)
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      const method = editingItem ? updateMutation : createMutation;
      if (!method) return;

      const response = editingItem
        ? await updateMutation.mutateAsync({ id: editingItem.id, data: values })
        : await createMutation.mutateAsync(values);

      const isSuccess = response?.code === 200;

      notification[isSuccess ? "success" : "error"]({
        title: isSuccess ? "Success" : "Error",
        description:
          response?.message ||
          (isSuccess
            ? `${entityName} ${editingItem ? "updated" : "created"} successfully`
            : editingItem
              ? `Failed to update ${entityName}`
              : Array.isArray(response?.data)
                ? response.data.join(", ")
                : `Failed to create ${entityName}`)
      });

      if (!isSuccess) return;

      if (mode === "page" && basePath) {
        navigate(basePath);
      } else {
        setIsModalOpen(false);
        form.resetFields();
        setEditingItem(null);
      }
      invalidateList();
    } catch (error: any) {
      notification.error({
        title: "Error",
        description: error?.message || "Operation failed"
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingItem(null);
  };

  const handleView = (record: T) => {
    if (onView) {
      onView(record);
      return;
    }

    if (mode === "page" && basePath) {
      navigate(`${basePath}/${record.id}`);
      return;
    }

    notification.info({ title: "Info", description: `View ${entityName}: ${(record as any).name || record.id}` });
  };

  // Combined loading state
  const loading =
    isFetchingList ||
    deleteMutation.isPending ||
    getByIdMutation.isPending ||
    createMutation.isPending ||
    updateMutation.isPending;

  return {
    // State
    data,
    loading,
    isModalOpen,
    editingItem,
    form,
    pagination: paginationMerged,

    // Actions
    handleColumnSearch,
    handleBulkColumnSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleTableChange,
    handleModalOk,
    handleModalCancel,

    // Utilities
    refresh: refetchList
  };
};
