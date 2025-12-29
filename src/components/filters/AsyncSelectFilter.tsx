import { Select } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AsyncSelectFilterProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  placeholder?: string;
  fetchOptions: () => Promise<Array<{ label: string; value: string | number }>>;
}

export const AsyncSelectFilter: React.FC<AsyncSelectFilterProps> = ({
  setSelectedKeys,
  selectedKeys,
  placeholder,
  fetchOptions
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<Array<{ label: string; value: string | number }>>([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <Select
      placeholder={placeholder || t("common.select")}
      value={selectedKeys[0]}
      onChange={(value) => setSelectedKeys(value ? [value] : [])}
      options={options}
      loading={loading}
      onOpenChange={(open) => {
        if (open) loadOptions();
      }}
      showSearch
      allowClear
    />
  );
};
