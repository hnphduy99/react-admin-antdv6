import type { ColumnSearchValue, TopSearchConfig } from "@/interfaces/searchTable.interface";
import { formatter, parser } from "@/utils/utils";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, InputNumber, Select, Space } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

type SearchValues = Record<string, any>;

interface TopSearchBarProps {
  configs: TopSearchConfig[];
  onSearch: (searches: Record<string, ColumnSearchValue | null>) => void;
}

export function TopSearchBar({ configs, onSearch }: TopSearchBarProps) {
  const [values, setValues] = useState<SearchValues>({});
  const [options, setOptions] = useState<Array<{ label: string; value: string | number }>>([]);
  const [loading, setLoading] = useState(false);

  const setValue = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const isEmptyValue = (value: unknown) =>
    value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);

  const handleSubmit = () => {
    const searches = configs.reduce<Record<string, ColumnSearchValue | null>>(
      (acc, { dataIndex, operator = "contain" }) => {
        const value = values[dataIndex];
        acc[dataIndex] = isEmptyValue(value) ? null : { value: value as string | number, operator };
        return acc;
      },
      {}
    );

    onSearch(searches);
  };

  const handleReset = () => {
    setValues({});
    onSearch(
      configs.reduce<Record<string, null>>((acc, c) => {
        acc[c.dataIndex] = null;
        return acc;
      }, {})
    );
  };

  const loadOptions = async (fetchOptions?: (keyword: string) => Promise<Array<{ label: string; value: any }>>) => {
    if (!fetchOptions) return;
    setLoading(true);
    try {
      const data = await fetchOptions("");
      setOptions(data);
    } catch (error) {
      console.error("Failed to load options:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (config: TopSearchConfig) => (
    <Input
      key={config.dataIndex}
      placeholder={config.placeholder ?? "Nhập"}
      allowClear
      value={(values[config.dataIndex] as string) ?? ""}
      onChange={(e) => setValue(config.dataIndex, e.target.value)}
      onPressEnter={handleSubmit}
      className="w-48"
    />
  );

  const renderNumberInput = (config: TopSearchConfig) => (
    <InputNumber
      key={config.dataIndex}
      placeholder={config.placeholder ?? "Nhập"}
      value={(values[config.dataIndex] as number) ?? ""}
      formatter={formatter}
      parser={parser}
      onChange={(val) => setValue(config.dataIndex, val)}
      onPressEnter={handleSubmit}
      className="w-48"
    />
  );

  const renderSelect = (config: TopSearchConfig) => (
    <Select
      key={config.dataIndex}
      placeholder={config.placeholder ?? "Chọn"}
      allowClear
      options={config.options}
      value={values[config.dataIndex]}
      onChange={(val) => setValue(config.dataIndex, val)}
      className="w-48"
    />
  );

  const renderAsyncSelect = (config: TopSearchConfig) => (
    <Select
      key={config.dataIndex}
      placeholder={config.placeholder ?? "Chọn"}
      allowClear
      options={options}
      loading={loading}
      onOpenChange={(open) => {
        if (open) loadOptions(config.fetchData);
      }}
      value={values[config.dataIndex]}
      onChange={(val) => setValue(config.dataIndex, val)}
      className="w-48"
    />
  );

  const renderDate = (config: TopSearchConfig) => {
    const value = values[config.dataIndex] as string | null;

    return (
      <DatePicker
        key={config.dataIndex}
        placeholder={config.placeholder ?? "Chọn"}
        format="DD/MM/YYYY"
        value={value ? dayjs(value) : null}
        onChange={(d) => setValue(config.dataIndex, d ? d.format("YYYY-MM-DD") : null)}
        className="w-48"
      />
    );
  };

  const renderDateRange = (config: TopSearchConfig) => {
    const valueString = values[config.dataIndex] as string | null;
    const value = valueString ? JSON.parse(valueString) : undefined;

    return (
      <DatePicker.RangePicker
        key={config.dataIndex}
        format="DD/MM/YYYY"
        placeholder={[config.placeholder ?? "Từ ngày", config.placeholder ?? "Đến ngày"]}
        value={value ? [value[0] ? dayjs(value[0]) : null, value[1] ? dayjs(value[1]) : null] : null}
        onChange={(dates) =>
          setValue(
            config.dataIndex,
            JSON.stringify([
              dates?.[0]?.format("YYYY-MM-DD 00:00:00") ?? null,
              dates?.[1]?.format("YYYY-MM-DD 23:59:59") ?? null
            ])
          )
        }
      />
    );
  };

  const renderFilter = (config: TopSearchConfig) => {
    switch (config.type) {
      case "input":
        return renderInput(config);
      case "number":
        return renderNumberInput(config);
      case "select":
        return renderSelect(config);
      case "asyncSelect":
        return renderAsyncSelect(config);
      case "date":
        return renderDate(config);
      case "dateRange":
        return renderDateRange(config);
      default:
        return null;
    }
  };

  if (!configs.length) return null;

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
