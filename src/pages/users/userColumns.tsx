import { optionsApi } from "@/apis/options.api";
import type { PaginationConfig } from "@/hooks/useCrudManagement";
import type { ColumnSearchValue } from "@/interfaces/searchTable.interface";
import type { IUser } from "@/interfaces/user.interface";
import { createColumnSearch } from "@/utils/tableSearchHelper";
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { TFunction } from "i18next";

export const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "red";
    case "moderator":
      return "orange";
    default:
      return "blue";
  }
};

export const createUserColumns = (
  t: TFunction<"translation", undefined>,
  handleView: (record: IUser) => void,
  handleEdit: (id: string | number) => void,
  handleDelete: (id: string | number) => void,
  handleColumnSearch: (value: ColumnSearchValue | null, column: string) => void,
  pagination: PaginationConfig,
  permissions: {
    canUpdate: boolean;
    canDelete: boolean;
    canView: boolean;
  }
): ColumnsType<IUser> => [
  {
    title: t("table.stt"),
    dataIndex: "stt",
    align: "right",
    render: (_text, _record, index) => (pagination.current - 1) * pagination.limit + index + 1,
    width: 50
  },
  {
    title: t("user.fullname"),
    dataIndex: "ho_va_ten",
    key: "ho_va_ten",
    ...createColumnSearch<IUser>({
      dataIndex: "ho_va_ten",
      typeSearch: "input",
      onSearch: handleColumnSearch,
      operator: "contain",
      placeholder: "Tìm họ và tên",
      showSearch: "both"
    }),
    render: (name, record) => (
      <div className="flex items-center gap-3">
        <Avatar icon={<UserOutlined />} src={record.avatar} />
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      </div>
    )
  },
  {
    title: t("user.username"),
    dataIndex: "tai_khoan",
    key: "tai_khoan",
    ...createColumnSearch<IUser>({
      dataIndex: "tai_khoan",
      typeSearch: "input",
      onSearch: handleColumnSearch,
      operator: "contain",
      placeholder: "Tìm tài khoản",
      showSearch: "top"
    })
  },
  {
    title: t("user.role"),
    dataIndex: "ma_vai_tro",
    key: "ma_vai_tro",
    ...createColumnSearch<IUser>({
      dataIndex: "users.ma_vai_tro",
      typeSearch: "asyncSelect",
      onSearch: handleColumnSearch,
      operator: "equal",
      fetchData: optionsApi.getRoles,
      placeholder: "Tìm vai trò",
      showSearch: "both"
    }),
    render: (role: string) => <Tag color={getRoleColor(role)}>{role?.toUpperCase()}</Tag>,
    width: 150
  },
  {
    title: t("table.status"),
    key: "trang_thai",
    dataIndex: "trang_thai",
    ...createColumnSearch<IUser>({
      dataIndex: "users.trang_thai",
      typeSearch: "select",
      options: [
        { label: "Hoạt động", value: 1 },
        { label: "Không hoạt động", value: "0" }
      ],
      onSearch: handleColumnSearch,
      operator: "equal",
      placeholder: "Tìm trạng thái",
      showSearch: "both"
    }),
    render: (status: number) => (
      <Tag color={status === 1 ? "green" : "red"}>{status === 1 ? "HOẠT ĐỘNG" : "KHÔNG HOẠT ĐỘNG"}</Tag>
    ),
    width: 150
  },
  {
    title: t("user.createdAt"),
    dataIndex: "ngay_tao",
    key: "ngay_tao",
    ...createColumnSearch<IUser>({
      dataIndex: "users.ngay_tao",
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
