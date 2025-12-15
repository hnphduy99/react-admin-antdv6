import CustomTable from "@/components/customize/CustomTable";
import { useCrudManagement } from "@/hooks/useCrudManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { mockApi } from "@/services/mock";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Space } from "antd";
import { useTranslation } from "react-i18next";
import { UserFormModal } from "./UserFormModal";
import { createUserColumns } from "./userColumns";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive";
  joinDate: string;
  avatar?: string;
}

export const UserList = () => {
  const { t } = useTranslation();

  // Use generic CRUD hook with User-specific config
  const {
    data,
    searchText,
    loading,
    isModalOpen,
    editingItem,
    form,
    pagination,
    setSearchText,
    handleSearch,
    handleColumnSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleTableChange,
    handleModalOk,
    handleModalCancel
  } = useCrudManagement<UserData>({
    apiService: {
      getAll: mockApi.user.getUsers,
      create: mockApi.user.createUser,
      update: mockApi.user.updateUser,
      delete: mockApi.user.deleteUser
    },
    entityName: "User"
  });

  const debouncedSearch = useDebounce(handleSearch, 500);

  const columns = createUserColumns(t, handleView, handleEdit, handleDelete, handleColumnSearch, pagination);

  return (
    <>
      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold m-0">{t("user.userList")}</h2>
          <Space>
            <Input
              placeholder={t("table.searchPlaceholder")}
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="w-64"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              {t("common.addNew")}
            </Button>
          </Space>
        </div>

        <CustomTable
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1000, y: "calc(100vh - 336px)" }}
        />
      </Card>

      <UserFormModal
        open={isModalOpen}
        editingUser={editingItem}
        loading={loading}
        form={form}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </>
  );
};
