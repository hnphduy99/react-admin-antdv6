import type { PaginationConfig } from "@/hooks/useCrudManagement";
import type { IUser } from "@/interfaces/user.interface";
import {
  getColumnDateTimeProps,
  getColumnInputSearchProps,
  getColumnSelectProps,
  type ColumnSearchValue
} from "@/utils/tableSearchHelper";
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

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
  t: any,
  handleView: (record: IUser) => void,
  handleEdit: (id: string | number) => void,
  handleDelete: (id: string | number) => void,
  handleColumnSearch: (value: ColumnSearchValue | null, column: string) => void,
  pagination: PaginationConfig
): ColumnsType<IUser> => [
  {
    title: t("table.stt"),
    dataIndex: "stt",
    align: "right",
    render: (_text, _record, index) => (pagination.current - 1) * pagination.limit + index + 1,
    width: 50
  },
  {
    title: t("table.name"),
    dataIndex: "ho_va_ten",
    key: "ho_va_ten",
    ...getColumnInputSearchProps<IUser>({
      dataIndex: "ho_va_ten",
      onSearch: handleColumnSearch,
      placeholder: "Tìm họ và tên",
      operator: "contain",
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
    title: t("table.username"),
    dataIndex: "tai_khoan",
    key: "tai_khoan",
    ...getColumnInputSearchProps<IUser>({
      dataIndex: "tai_khoan",
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
    ...getColumnSelectProps<IUser>({
      dataIndex: "ma_vai_tro",
      placeholder: "Select role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Moderator", value: "moderator" }
      ],
      onSearch: handleColumnSearch,
      operator: "equal"
    }),
    render: (role: string) => <Tag color={getRoleColor(role)}>{role?.toUpperCase()}</Tag>,
    width: 150
  },
  {
    title: t("table.status"),
    key: "trang_thai",
    dataIndex: "trang_thai",
    ...getColumnSelectProps<IUser>({
      dataIndex: "trang_thai",
      options: [
        { label: "Active", value: 1 },
        { label: "Inactive", value: "0" }
      ],
      onSearch: handleColumnSearch,
      operator: "equal",
      placeholder: "Tìm trạng thái",
      showSearch: "top"
    }),
    render: (status: number) => (
      <Tag color={status === 1 ? "green" : "red"}>{status === 1 ? "ACTIVE" : "INACTIVE"}</Tag>
    ),
    width: 150
  },
  {
    title: t("user.joinDate"),
    dataIndex: "ngay_tao",
    key: "ngay_tao",
    ...getColumnDateTimeProps<IUser>({
      dataIndex: "ngay_tao",
      mode: "range",
      onSearch: handleColumnSearch,
      operator: "between",
      showSearch: "top"
    }),
    align: "right",
    render: (joinDate) => dayjs(joinDate).format("DD/MM/YYYY HH:mm"),
    width: 150
  },
  {
    title: t("common.actions"),
    key: "action",
    render: (_, record) => (
      <Space size={0}>
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
        <Popconfirm
          title={t("table.deleteConfirm")}
          onConfirm={() => handleDelete(record.id)}
          okText={t("common.yes")}
          cancelText={t("common.no")}
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      </Space>
    ),
    width: 120,
    fixed: "end"
  }
];
