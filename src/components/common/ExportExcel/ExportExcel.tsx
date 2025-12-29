import { exportToExcel } from "@/utils/excelHelper";
import { FileExcelOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { TFunction } from "i18next";

export default function ExportExcel({
  columns,
  dataSource,
  fileName,
  t
}: {
  columns: any[];
  dataSource: any[];
  fileName: string;
  t: TFunction<"translation", undefined>;
}) {
  const handleExportExcel = () => {
    exportToExcel(columns, dataSource, fileName);
  };
  return (
    <Button color="green" variant="solid" icon={<FileExcelOutlined />} onClick={handleExportExcel}>
      {t("common.exportExcel")}
    </Button>
  );
}
