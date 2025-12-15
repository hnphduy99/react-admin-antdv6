import { Select } from "antd";
import { useTranslation } from "react-i18next";

interface SelectFilterProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  placeholder?: string;
  options: Array<{ label: string; value: string | number }>;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({ setSelectedKeys, selectedKeys, placeholder, options }) => {
  const { t } = useTranslation();

  return (
    <Select
      placeholder={placeholder || t("common.select")}
      value={selectedKeys[0]}
      onChange={(value) => setSelectedKeys(value ? [value] : [])}
      options={options}
      showSearch
      allowClear
    />
  );
};
