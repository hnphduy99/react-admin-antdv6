import type { PaginationConfig } from "@/hooks/useCrudManagement";
import type { ColumnSearchValue } from "@/interfaces/searchTable.interface";
import type { I[ComponentName] } from "@/interfaces/[componentName].interface";
import { getColumnDateTimeAdvancedProps } from "@/utils/tableSearchHelper";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { TFunction } from "i18next";

export const create[ComponentName]Columns = (
  t: TFunction<"translation", undefined>,
  handleView: (record: I[ComponentName]) => void,
  handleEdit: (id: string | number) => void,
  handleDelete: (id: string | number) => void,
  handleColumnSearch: (value: ColumnSearchValue | null, column: string) => void,
  pagination: PaginationConfig,
  permissions?: {
    canUpdate?: boolean;
    canDelete?: boolean;
    canView?: boolean;
  }
): ColumnsType<I[ComponentName]> => [
  {
    title: t("table.stt"),
    dataIndex: "stt",
    align: "right",
    render: (_text, _record, index) => (pagination.current - 1) * pagination.limit + index + 1,
    width: 50
  },
  //create column here
  {
    title: t("createdAt"),
    dataIndex: "ngay_tao",
    key: "ngay_tao",
    ...getColumnDateTimeAdvancedProps<I[ComponentName]>({
      dataIndex: "ngay_tao",
      mode: "range",
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
        {permissions?.canView && <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)} />}
        {permissions?.canUpdate && <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />}
        {permissions?.canDelete && (
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