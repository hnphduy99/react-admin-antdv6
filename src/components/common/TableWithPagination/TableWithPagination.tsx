import type { PaginationConfig } from "@/hooks/useCrudManagement";
import { Table, type TableProps } from "antd";
import { useTranslation } from "react-i18next";

interface TableWithPaginationProps<T> extends TableProps<T> {
  pagination?: PaginationConfig;
}

export default function TableWithPagination<T>(props: TableWithPaginationProps<T>) {
  const { t } = useTranslation();
  const { bordered = true, size = "small", pagination } = props;

  return (
    <Table
      {...props}
      bordered={bordered}
      size={size}
      locale={{ emptyText: t("table.emptyText") }}
      pagination={
        pagination
          ? {
              ...pagination,
              placement: ["bottomCenter"],
              showSizeChanger: true,
              showTotal: (total) => t("common.total", { count: total })
            }
          : false
      }
    />
  );
}
