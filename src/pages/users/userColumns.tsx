import type { PaginationConfig } from "@/hooks/useCrudManagement";
import { getColumnDateTimeProps, getColumnInputSearchProps, getColumnSelectProps } from "@/utils/tableSearchHelper";
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive";
  joinDate: string;
  avatar?: string;
}

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
  handleView: (record: UserData) => void,
  handleEdit: (record: UserData) => void,
  handleDelete: (id: string) => void,
  handleColumnSearch: (value: string, column: string) => void,
  pagination: PaginationConfig
): ColumnsType<UserData> => [
  {
    title: t("table.stt"),
    dataIndex: "stt",
    align: "right",
    render: (_text, _record, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
    width: 50
  },
  {
    title: t("table.name"),
    dataIndex: "name",
    key: "name",
    ...getColumnInputSearchProps<UserData>({
      dataIndex: "name",
      placeholder: t("table.searchName"),
      onSearch: handleColumnSearch
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
    title: t("user.role"),
    dataIndex: "role",
    key: "role",
    ...getColumnSelectProps<UserData>({
      dataIndex: "role",
      placeholder: "Select role",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Moderator", value: "moderator" }
      ],
      onSearch: handleColumnSearch
    }),
    render: (role: string) => <Tag color={getRoleColor(role)}>{t(`user.${role}`).toUpperCase()}</Tag>,
    width: 150
  },
  {
    title: t("table.status"),
    key: "status",
    dataIndex: "status",
    ...getColumnSelectProps<UserData>({
      dataIndex: "status",
      placeholder: "Select status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" }
      ],
      onSearch: handleColumnSearch
    }),
    render: (status: string) => (
      <Tag color={status === "active" ? "green" : "red"}>{t(`table.${status}`).toUpperCase()}</Tag>
    ),
    width: 150
  },
  {
    title: t("user.joinDate"),
    dataIndex: "joinDate",
    key: "joinDate",
    ...getColumnDateTimeProps<UserData>({
      dataIndex: "createdAt",
      placeholder: "Ngày tạo",
      mode: "single",
      onSearch: handleColumnSearch
    }),
    align: "right",
    render: (joinDate) => dayjs(joinDate).format("DD/MM/YYYY"),
    width: 150
  },
  {
    title: t("common.actions"),
    key: "action",
    render: (_, record) => (
      <Space size={0}>
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
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
