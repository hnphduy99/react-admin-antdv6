import { userApi } from "@/apis/user.api";
import { ExportExcel, TableWithPagination } from "@/components/common";
import { TopSearchBar } from "@/components/filters/TopSearchBar";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useCrudManagement } from "@/hooks/useCrudManagement";
import type { IUser } from "@/interfaces/user.interface";
import { getPermissionByResource } from "@/utils/permissions";
import { getTopSearchConfigs } from "@/utils/tableSearchHelper";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space } from "antd";
import { useTranslation } from "react-i18next";
import { createUserColumns } from "./userColumns";
import { UserFormModal } from "./UserFormModal";

export const UserList = () => {
  const { t } = useTranslation();

  const actions = getPermissionByResource("users");
  const canViewTable = actions?.index;
  const canCreate = actions?.create;
  const canUpdate = actions?.edit;
  const canDelete = actions?.delete;
  const canView = actions?.show;
  const canExport = actions?.export;

  const {
    data,
    loading,
    isModalOpen,
    editingItem,
    form,
    pagination,
    handleColumnSearch,
    handleBulkColumnSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleTableChange,
    handleModalOk,
    handleModalCancel
  } = useCrudManagement<IUser>({
    apiService: {
      getAll: userApi.getUserList,
      getById: userApi.getUserById,
      create: userApi.createUser,
      update: userApi.updateUser,
      delete: userApi.deleteUser
    },
    entityName: "Users"
  });

  const columns = createUserColumns(t, handleView, handleEdit, handleDelete, handleColumnSearch, pagination, {
    canUpdate,
    canDelete,
    canView
  });
  const topSearchConfigs = getTopSearchConfigs(columns);

  return (
    <>
      <PageTitle>{t("user.userList")}</PageTitle>

      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold m-0 uppercase">{t("user.userList")}</h2>
          <Space>
            {canExport && <ExportExcel columns={columns} dataSource={data} fileName="Danh_sach_nguoi_dung" t={t} />}
            {canCreate && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                {t("common.addNew")}
              </Button>
            )}
          </Space>
        </div>

        {canViewTable && (
          <>
            <TopSearchBar configs={topSearchConfigs} onSearch={handleBulkColumnSearch} />

            <TableWithPagination
              columns={columns}
              dataSource={data}
              loading={loading}
              rowKey="id"
              pagination={pagination}
              onChange={handleTableChange}
              scroll={{ x: 1000, y: "calc(100vh - 336px)" }}
            />
          </>
        )}
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
