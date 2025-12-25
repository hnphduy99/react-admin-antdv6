import type { ApiResponse } from "@/apis/auth.api";
import type { PaginatedResponse } from "@/apis/user.api";
import { PER_PAGE } from "@/constants/constants";
import { useNotification } from "@/providers/NotificationProvider";
import type { ColumnSearchValue, SearchOperator } from "@/utils/tableSearchHelper";
import { Form } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  create: (data: T) => Promise<ApiResponse<T>>;
  update: (id: string | number, data: T) => Promise<ApiResponse<T>>;
  delete: (id: string | number) => Promise<ApiResponse<T>>;
}

interface CrudConfig<T> {
  apiService: CrudApiService<T>;
  entityName: string;
  onView?: (item: T) => void;
}

export interface PaginationConfig {
  current: number;
  limit: number;
  total: number;
}

/**
 * Generic CRUD Hook
 * Reusable hook for all CRUD operations (Create, Read, Update, Delete)
 *
 * @example
 * const userCrud = useCrudManagement({
 *   apiService: mockApi.user,
 *   entityName: "User"
 * });
 */
export const useCrudManagement = <T extends { id: number }>(config: CrudConfig<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [columnSearches, setColumnSearches] = useState<ColumnSearchItem[]>([]); // Column-specific searches as array
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    limit: PER_PAGE,
    total: 0
  });
  const notification = useNotification();

  const { apiService, entityName, onView } = useMemo(
    () => ({
      apiService: config.apiService,
      entityName: config.entityName,
      onView: config.onView
    }),
    [config.apiService, config.entityName, config.onView]
  );

  // Fetch data from API
  const fetchData = useCallback(
    async (page = 1, limit = PER_PAGE, colSearches: ColumnSearchItem[] = []) => {
      if (!apiService.getAll) {
        console.warn("getAll method not provided in apiService");
        return;
      }

      try {
        setLoading(true);
        const response = await apiService.getAll(page, limit, colSearches);

        if (response.code === 200) {
          setData(response.data.collection);
          setPagination({
            current: response.data.current_page,
            limit: PER_PAGE,
            total: response.data.total
          });
        }
      } catch (error: any) {
        notification.error({ title: "Error", description: error.message || `Failed to load ${entityName}s` });
      } finally {
        setLoading(false);
      }
    },
    [apiService, entityName, notification]
  );

  useEffect(() => {
    fetchData(1, PER_PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      setColumnSearches(updatedSearches);
      fetchData(1, pagination.limit, updatedSearches);
    },
    [columnSearches, fetchData, pagination.limit]
  );

  const handleColumnSearch = useCallback(
    (value: ColumnSearchValue | null, column: string) => {
      applyColumnSearches({ [column]: value });
    },
    [applyColumnSearches]
  );

  const handleBulkColumnSearch = useCallback(
    (searches: Record<string, ColumnSearchValue | null>) => {
      applyColumnSearches(searches);
    },
    [applyColumnSearches]
  );

  const handleTableChange = (newPagination: any, _filters: any, _sorter: any, extra: any) => {
    if (extra?.action === "paginate") {
      fetchData(newPagination.current, newPagination.pageSize, columnSearches);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = async (id: string | number) => {
    try {
      setLoading(true);
      if (!apiService.getById) {
        console.warn("getById method not provided in apiService");
        return;
      }
      const response = await apiService.getById(id);

      if (response.code === 200) {
        setEditingItem(response.data);
        form.setFieldsValue(response.data);
        setIsModalOpen(true);
      }
    } catch (error: any) {
      notification.error({ title: "Error", description: error.message || `Failed to load ${entityName}` });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string | number) => {
    try {
      setLoading(true);
      const response = await apiService.delete(id);

      if (response.code === 200) {
        notification.success({
          title: "Success",
          description: response.message || `${entityName} deleted successfully`
        });
        await fetchData(pagination.current, pagination.limit, columnSearches);
      }
    } catch (error: any) {
      notification.error({ title: "Error", description: error.message || `Failed to delete ${entityName}` });
    } finally {
      setLoading(false);
    }
  };

  // Handle modal submit (Create or Update)
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingItem) {
        // Update existing item
        const response = await apiService.update(editingItem.id, values);
        if (response.code === 200) {
          notification.success({
            title: "Success",
            description: response.message || `${entityName} updated successfully`
          });
        }
      } else {
        // Create new item
        const response = await apiService.create(values);
        if (response.code === 200) {
          notification.success({
            title: "Success",
            description: response.message || `${entityName} created successfully`
          });
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      await fetchData(pagination.current, pagination.limit, columnSearches);
    } catch (error: any) {
      if (error.errorFields) {
        // Form validation errors
        return;
      }
      notification.error({ title: "Error", description: error.message || "Operation failed" });
    } finally {
      setLoading(false);
    }
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingItem(null);
  };

  const handleView = (record: T) => {
    if (onView) {
      onView(record);
    } else {
      notification.info({ title: "Info", description: `View ${entityName}: ${(record as any).name || record.id}` });
    }
  };

  return {
    // State
    data,
    loading,
    isModalOpen,
    editingItem,
    form,
    pagination,

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
    refresh: () => fetchData(pagination.current, pagination.limit, columnSearches)
  };
};
