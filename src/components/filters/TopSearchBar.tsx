import { Input, Select, DatePicker, Space, Button } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import type { ColumnSearchValue, SearchOperator } from "@/utils/tableSearchHelper";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useState } from "react";

const { RangePicker } = DatePicker;

export interface TopSearchConfig {
  dataIndex: string;
  type: "input" | "select" | "date" | "dateRange";
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  operator?: SearchOperator;
}

interface TopSearchBarProps {
  configs: TopSearchConfig[];
  onSearch: (searches: Record<string, ColumnSearchValue | null>) => void;
}

export function TopSearchBar({ configs, onSearch }: TopSearchBarProps) {
  const [values, setValues] = useState<Record<string, any>>({});

  const handleValueChange = useCallback((dataIndex: string, value: any) => {
    setValues((prev) => ({ ...prev, [dataIndex]: value }));
  }, []);

  const handleSubmit = useCallback(() => {
    const bulkSearches: Record<string, ColumnSearchValue | null> = {};

    configs.forEach((config) => {
      const { dataIndex, operator = "contain" } = config;
      const value = values[dataIndex];

      if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
        bulkSearches[dataIndex] = null;
      } else {
        bulkSearches[dataIndex] = { value, operator };
      }
    });

    onSearch(bulkSearches);
  }, [configs, values, onSearch]);

  const handleReset = useCallback(() => {
    setValues({});
    const bulkResets: Record<string, null> = {};
    configs.forEach((config) => {
      bulkResets[config.dataIndex] = null;
    });
    onSearch(bulkResets);
  }, [configs, onSearch]);

  const renderFilter = (config: TopSearchConfig) => {
    const { dataIndex, type, placeholder, options } = config;

    switch (type) {
      case "input":
        return (
          <Input
            key={dataIndex}
            placeholder={placeholder ?? "Nhập"}
            allowClear
            value={values[dataIndex] || ""}
            onChange={(e) => handleValueChange(dataIndex, e.target.value)}
            onPressEnter={handleSubmit}
            className="w-48"
          />
        );

      case "select":
        return (
          <Select
            key={dataIndex}
            placeholder={placeholder ?? "Chọn"}
            allowClear
            options={options}
            value={values[dataIndex]}
            onChange={(val) => handleValueChange(dataIndex, val)}
            className="w-48"
          />
        );

      case "date":
        return (
          <DatePicker
            key={dataIndex}
            placeholder={placeholder ?? "Chọn"}
            format="DD/MM/YYYY"
            value={values[dataIndex] ? dayjs(values[dataIndex]) : null}
            onChange={(date: Dayjs | null) => handleValueChange(dataIndex, date ? date.format("YYYY-MM-DD") : null)}
            className="w-48"
          />
        );

      case "dateRange":
        return (
          <RangePicker
            key={dataIndex}
            placeholder={[placeholder ?? "Từ ngày", placeholder ?? "Đến ngày"]}
            format="DD/MM/YYYY"
            value={
              values[dataIndex]
                ? [
                    values[dataIndex][0] ? dayjs(values[dataIndex][0]) : null,
                    values[dataIndex][1] ? dayjs(values[dataIndex][1]) : null
                  ]
                : null
            }
            onChange={(dates) => {
              const formatted = dates?.map((d) => (d ? d.format("YYYY-MM-DD") : "")) ?? [];
              handleValueChange(dataIndex, formatted.length > 0 ? formatted : null);
            }}
          />
        );

      default:
        return null;
    }
  };

  if (configs.length === 0) return null;

  return (
    <Space wrap className="mb-4">
      {configs.map(renderFilter)}
      <Button type="primary" icon={<SearchOutlined />} onClick={handleSubmit}>
        Tìm kiếm
      </Button>
      <Button icon={<ReloadOutlined />} onClick={handleReset}>
        Làm mới
      </Button>
    </Space>
  );
}
