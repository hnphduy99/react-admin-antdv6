import { rolesApi } from "@/apis/roles.api";
import ExportExcel from "@/components/common/ExportExcel/ExportExcel";
import TableWithPagination from "@/components/common/TableWithPagination/TableWithPagination";
import { TopSearchBar } from "@/components/filters/TopSearchBar";
import PageTitle from "@/components/PageTitle/PageTitle";
import { RESOURCE } from "@/configs/api-config";
import { useCrudManagement } from "@/hooks/useCrudManagement";
import type { IRoles } from "@/interfaces/roles.interface";
import { getPermissionByResource } from "@/utils/permissions";
import { getTopSearchConfigs } from "@/utils/tableSearchHelper";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Space } from "antd";
import { useTranslation } from "react-i18next";
import { createRolesColumns } from "./rolesColumns";
import { RolesFormModal } from "./RolesFormModal";

const RolesList = () => {
  const { t } = useTranslation();
  const entityName = RESOURCE.ROLES;

  const actions = getPermissionByResource(entityName);
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
  } = useCrudManagement<IRoles>({
    apiService: {
      getAll: rolesApi.getRolesList,
      getById: rolesApi.getRolesById,
      create: rolesApi.createRoles,
      update: rolesApi.updateRoles,
      delete: rolesApi.deleteRoles
    },
    entityName
  });

  const columns = createRolesColumns(t, handleView, handleEdit, handleDelete, handleColumnSearch, pagination, {
    canUpdate,
    canDelete,
    canView
  });
  const topSearchConfigs = getTopSearchConfigs(columns);

  return (
    <>
      <PageTitle>{t("menu.roleList")}</PageTitle>

      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold m-0 uppercase">{t("menu.roleList")}</h2>
          <Space>
            {canExport && <ExportExcel columns={columns} dataSource={data} fileName="roles" t={t} />}
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

      <RolesFormModal
        t={t}
        open={isModalOpen}
        editingItem={editingItem}
        loading={loading}
        form={form}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </>
  );
};

export default RolesList;
