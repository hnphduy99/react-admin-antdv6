import type { PaginationConfig } from "@/hooks/useCrudManagement";
import type { Product } from "@/types";
import {
  getColumnDateTimeProps,
  getColumnInputSearchProps,
  getColumnNumberRangeProps,
  type ColumnSearchValue
} from "@/utils/tableSearchHelper";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

export const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    Electronics: "blue",
    Clothing: "purple",
    Food: "orange",
    Books: "green",
    "Home & Garden": "cyan"
  };
  return colorMap[category] || "default";
};

export const createProductColumns = (
  t: any,
  handleView: (record: Product) => void,
  handleEdit: (record: Product) => void,
  handleDelete: (id: string) => void,
  handleColumnSearch: (value: ColumnSearchValue | null, column: string) => void,
  pagination: PaginationConfig
): ColumnsType<Product> => [
  {
    title: t("table.stt"),
    dataIndex: "stt",
    align: "right",
    render: (_text, _record, index) => pagination.current * pagination.limit + index + 1,
    width: 50
  },
  {
    title: t("product.productName"),
    dataIndex: "name",
    key: "name",
    ...getColumnInputSearchProps<Product>({
      dataIndex: "name",
      placeholder: t("product.searchProduct"),
      onSearch: handleColumnSearch,
      operator: "contain"
    }),
    render: (name) => <span className="font-medium">{name}</span>
  },
  {
    title: t("product.price"),
    dataIndex: "price",
    key: "price",
    ...getColumnNumberRangeProps<Product>({
      dataIndex: "price",
      minPlaceholder: t("product.minPrice"),
      maxPlaceholder: t("product.maxPrice"),
      onSearch: handleColumnSearch,
      operator: "between"
    }),
    render: (price) => price.toFixed(2),
    align: "right",
    width: 120
  },
  {
    title: t("product.stock"),
    dataIndex: "stock",
    key: "stock",
    render: (stock) => (
      <Tag color={stock > 50 ? "green" : stock > 20 ? "orange" : "red"}>
        {stock} {t("product.units")}
      </Tag>
    ),
    width: 120
  },
  {
    title: t("product.category"),
    dataIndex: "category",
    key: "category",
    filters: [
      { text: t("product.electronics"), value: "Electronics" },
      { text: t("product.clothing"), value: "Clothing" },
      { text: t("product.food"), value: "Food" },
      { text: t("product.books"), value: "Books" },
      { text: t("product.homeGarden"), value: "Home & Garden" }
    ],
    onFilter: (value, record) => record.category === value,
    render: (category) => <Tag color={getCategoryColor(category)}>{category}</Tag>,
    width: 150
  },
  {
    title: t("table.status"),
    dataIndex: "status",
    key: "status",
    filters: [
      { text: t("table.active"), value: "active" },
      { text: t("table.inactive"), value: "inactive" }
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => <Tag color={status === "active" ? "green" : "red"}>{t(`table.${status}`).toUpperCase()}</Tag>,
    width: 150
  },
  {
    title: t("product.created"),
    dataIndex: "createdAt",
    key: "createdAt",
    ...getColumnDateTimeProps<Product>({
      dataIndex: "createdAt",
      placeholder: "Ngày tạo",
      mode: "single",
      onSearch: handleColumnSearch,
      operator: "equal"
    }),
    align: "right",
    render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY"),
    width: 120
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
