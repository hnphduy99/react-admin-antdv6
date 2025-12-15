import CustomTable from "@/components/customize/CustomTable";
import { mockApi } from "@/services/mock";
import type { TableData } from "@/types";
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Input, Popconfirm, Space, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const TableExample = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<TableData[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Fetch data from API
  const fetchData = useCallback(async (page = 1, pageSize = 10, search = "") => {
    try {
      setLoading(true);
      const response = await mockApi.table.getTableData(page, pageSize, search);

      if (response.success) {
        setData(response.data.data);
        setPagination({
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total
        });
      }
    } catch (error) {
      message.error("Failed to load data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchData(1, 10, "");
  }, [fetchData]);

  // Handle search with debounce
  useEffect(() => {
    if (searchText === "") {
      // If search is cleared, fetch immediately
      fetchData(1, pagination.pageSize, searchText);
      return;
    }

    const timer = setTimeout(() => {
      fetchData(1, pagination.pageSize, searchText);
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [searchText, pagination.pageSize, fetchData]);

  const handleDelete = async (key: string) => {
    try {
      setLoading(true);
      const response = await mockApi.table.deleteRecord(key);

      if (response.success) {
        message.success(response.message || "Record deleted successfully");
        // Refresh data
        await fetchData(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error) {
      message.error("Failed to delete record");
      console.error("Error deleting record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (key: string) => {
    message.info(`Edit record ${key}`);
  };

  const handleTableChange = (newPagination: any) => {
    fetchData(newPagination.current, newPagination.pageSize, searchText);
  };

  const columns: ColumnsType<TableData> = [
    {
      title: t("table.name"),
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: t("table.age"),
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      width: 100
    },
    {
      title: t("table.address"),
      dataIndex: "address",
      key: "address"
    },
    {
      title: t("table.tags"),
      key: "tags",
      dataIndex: "tags",
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag color={tag === "developer" ? "blue" : "green"} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          ))}
        </>
      )
    },
    {
      title: t("table.status"),
      key: "status",
      dataIndex: "status",
      filters: [
        { text: t("table.active"), value: "active" },
        { text: t("table.inactive"), value: "inactive" }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => <Tag color={status === "active" ? "green" : "red"}>{status.toUpperCase()}</Tag>,
      width: 120
    },
    {
      title: t("common.actions"),
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.key)} />

          <Popconfirm
            title={t("table.deleteConfirm")}
            onConfirm={() => handleDelete(record.key)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
      width: 120
    }
  ];

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold m-0">{t("table.userTable")}</h2>
          <Space>
            <Input
              placeholder={t("table.searchPlaceholder")}
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
            />
            <Button type="primary" icon={<PlusOutlined />}>
              {t("common.addNew")}
            </Button>
          </Space>
        </div>

        <CustomTable
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};
