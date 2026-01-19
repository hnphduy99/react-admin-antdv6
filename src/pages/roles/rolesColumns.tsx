import type { PaginationConfig } from "@/hooks/useCrudManagement";
import type { IRoles } from "@/interfaces/roles.interface";
import type { ColumnSearchValue } from "@/interfaces/searchTable.interface";
import { createColumnSearch } from "@/utils/tableSearchHelper";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { TFunction } from "i18next";

export const createRolesColumns = (
  t: TFunction<"translation", undefined>,
  handleView: (record: IRoles) => void,
  handleEdit: (id: string | number) => void,
  handleDelete: (id: string | number) => void,
  handleColumnSearch: (value: ColumnSearchValue | null, column: string) => void,
  pagination: PaginationConfig,
  permissions: {
    canUpdate: boolean;
    canDelete: boolean;
    canView: boolean;
  }
): ColumnsType<IRoles> => [
  {
    title: t("table.stt"),
    dataIndex: "stt",
    align: "right",
    render: (_text, _record, index) => (pagination.current - 1) * pagination.limit + index + 1,
    width: 50
  },
  {
    title: t("roles.roleCode"),
    dataIndex: "ma_vai_tro",
    key: "ma_vai_tro",
    ...createColumnSearch<IRoles>({
      dataIndex: "roles.ma_vai_tro",
      typeSearch: "input",
      onSearch: handleColumnSearch,
      operator: "contain",
      showSearch: "both"
    }),
    width: 150
  },
  {
    title: t("roles.roleName"),
    dataIndex: "ten_vai_tro",
    key: "ten_vai_tro",
    ...createColumnSearch<IRoles>({
      dataIndex: "roles.ten_vai_tro",
      typeSearch: "input",
      onSearch: handleColumnSearch,
      operator: "contain",
      showSearch: "both"
    }),
    width: 150
  },
  //create column here
  {
    title: t("roles.createdAt"),
    dataIndex: "ngay_tao",
    key: "ngay_tao",
    ...createColumnSearch<IRoles>({
      dataIndex: "roles.ngay_tao",
      typeSearch: "dateRange",
      onSearch: handleColumnSearch,
      operator: "between",
      showSearch: "both"
    }),
    align: "right",
    render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY HH:mm"),
    width: 150
  },
  {
    title: t("common.actions"),
    key: "action",
    render: (_, record) => (
      <Space size={0}>
        {permissions.canView && <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />}
        {permissions.canUpdate && <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />}
        {permissions.canDelete && (
          <Popconfirm
            title={t("table.deleteConfirm")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        )}
      </Space>
    ),
    width: 120,
    fixed: "end"
  }
];
