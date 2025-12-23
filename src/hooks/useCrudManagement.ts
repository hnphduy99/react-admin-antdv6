import { PER_PAGE } from "@/constants/constants";
import { useNotification } from "@/providers/NotificationProvider";
import { Form } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

interface CrudApiService<T> {
  getAll?: (page: number, pageSize: number, search?: string, columnSearches?: Record<string, string>) => Promise<any>;
  getById?: (id: string) => Promise<any>;
  create: (data: Partial<T>) => Promise<any>;
  update: (id: string, data: Partial<T>) => Promise<any>;
  delete: (id: string) => Promise<any>;
}

interface CrudConfig<T> {
  apiService: CrudApiService<T>;
  entityName: string;
  onView?: (item: T) => void;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
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
export const useCrudManagement = <T extends { id: string }>(config: CrudConfig<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [searchText, setSearchText] = useState("");
  const [columnSearches, setColumnSearches] = useState<Record<string, string>>({}); // Column-specific searches
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState<PaginationConfig>({
    current: 1,
    pageSize: PER_PAGE,
    total: 0
  });
  const notification = useNotification();

  // Memoize config to prevent recreation on every render
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
    async (page = 1, pageSize = 10, search = "", colSearches: Record<string, string> = {}) => {
      if (!apiService.getAll) {
        console.warn("getAll method not provided in apiService");
        return;
      }

      try {
        setLoading(true);
        const response = await apiService.getAll(page, pageSize, search, colSearches);

        if (response.success) {
          setData(response.data.data);
          setPagination({
            current: response.data.page,
            pageSize: response.data.pageSize,
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
    fetchData(1, 10, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchText(value);
      fetchData(1, pagination.pageSize, value, columnSearches);
    },
    [fetchData, pagination.pageSize, columnSearches]
  );

  const handleColumnSearch = useCallback(
    (value: string, column: string) => {
      const updatedSearches = { ...columnSearches };
      if (!value) {
        delete updatedSearches[column];
      } else {
        updatedSearches[column] = value;
      }
      setColumnSearches(updatedSearches);
      // Pass column filters to API
      fetchData(1, pagination.pageSize, searchText, updatedSearches);
    },
    [fetchData, pagination.pageSize, searchText, columnSearches]
  );

  // Handle table pagination change
  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize, searchText, columnSearches);
  };

  // Open create modal
  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open edit modal
  const handleEdit = (record: T) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const response = await apiService.delete(id);

      if (response.success) {
        notification.success({
          title: "Success",
          description: response.message || `${entityName} deleted successfully`
        });
        await fetchData(pagination.current, pagination.pageSize, searchText, columnSearches);
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
        if (response.success) {
          notification.success({
            title: "Success",
            description: response.message || `${entityName} updated successfully`
          });
        }
      } else {
        // Create new item
        const response = await apiService.create(values);
        if (response.success) {
          notification.success({
            title: "Success",
            description: response.message || `${entityName} created successfully`
          });
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      await fetchData(pagination.current, pagination.pageSize, searchText, columnSearches);
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
    searchText,
    loading,
    isModalOpen,
    editingItem,
    form,
    pagination,

    // Actions
    setSearchText,
    handleSearch,
    handleColumnSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleTableChange,
    handleModalOk,
    handleModalCancel,

    // Utilities
    refresh: () => fetchData(pagination.current, pagination.pageSize, searchText, columnSearches)
  };
};
