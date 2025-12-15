import { Button, Space } from "antd";
import { useTranslation } from "react-i18next";

export default function ActionFilter({
  handleSearch,
  handleReset,
  close
}: {
  handleSearch: () => void;
  handleReset: () => void;
  close: () => void;
}) {
  const { t } = useTranslation();
  return (
    <Space>
      <Button type="primary" size="small" onClick={handleSearch}>
        {t("common.search")}
      </Button>
      <Button size="small" onClick={handleReset}>
        {t("common.reset")}
      </Button>
      <Button type="link" size="small" onClick={close}>
        {t("common.close")}
      </Button>
    </Space>
  );
}
