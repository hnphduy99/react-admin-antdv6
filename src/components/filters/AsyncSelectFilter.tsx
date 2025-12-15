import { Button, Flex, Select, Space } from "antd";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AsyncSelectFilterProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
  close: () => void;
  placeholder?: string;
  fetchOptions: () => Promise<Array<{ label: string; value: string | number }>>;
  onSearch: (value: string) => void;
  onReset: () => void;
}

export const AsyncSelectFilter: React.FC<AsyncSelectFilterProps> = ({
  setSelectedKeys,
  selectedKeys,
  confirm,
  clearFilters,
  close,
  placeholder,
  fetchOptions,
  onSearch,
  onReset
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<Array<{ label: string; value: string | number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);
      try {
        const data = await fetchOptions();
        setOptions(data);
      } catch (error) {
        console.error("Failed to load options:", error);
      } finally {
        setLoading(false);
      }
    };
    loadOptions();
  }, [fetchOptions]);

  const handleSearch = () => {
    confirm({ closeDropdown: true });
    onSearch(String(selectedKeys[0] || ""));
  };

  const handleReset = () => {
    clearFilters?.();
    onReset();
  };

  const handleClose = () => {
    close();
    confirm({ closeDropdown: true });
  };

  return (
    <Flex vertical gap={8} style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
      <Select
        placeholder={placeholder || t("common.select")}
        value={selectedKeys[0]}
        onChange={(value) => setSelectedKeys(value ? [value] : [])}
        options={options}
        loading={loading}
        showSearch
        allowClear
      />
      <Space>
        <Button type="primary" onClick={handleSearch} size="small">
          {t("common.search")}
        </Button>
        <Button onClick={handleReset} size="small">
          {t("common.reset")}
        </Button>
        <Button type="link" size="small" onClick={handleClose}>
          {t("common.close")}
        </Button>
      </Space>
    </Flex>
  );
};
