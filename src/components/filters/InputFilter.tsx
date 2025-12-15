import { Input, type InputRef } from "antd";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

interface InputFilterProps {
  placeholder?: string;
  selectedKeys: React.Key[];
  setSelectedKeys: (keys: React.Key[]) => void;
  handleSearch: () => void;
}

export const InputFilter: React.FC<InputFilterProps> = ({
  placeholder,
  selectedKeys,
  setSelectedKeys,
  handleSearch
}) => {
  const { t } = useTranslation();
  const searchInput = useRef<InputRef>(null);

  return (
    <Input
      ref={searchInput}
      placeholder={placeholder || t("common.search")}
      value={selectedKeys[0]}
      onPressEnter={handleSearch}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    />
  );
};
