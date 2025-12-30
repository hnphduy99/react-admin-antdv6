import type { I[ComponentName] } from "@/interfaces/[componentName].interface";
import { Form, Modal } from "antd";
import { useTranslation } from "react-i18next";

interface [ComponentName]FormModalProps {
  open: boolean;
  editing[ComponentName]: I[ComponentName] | null;
  loading: boolean;
  form: any;
  onOk: () => void;
  onCancel: () => void;
}

export const [ComponentName]FormModal = ({ open, editing[ComponentName], loading, form, onOk, onCancel }: [ComponentName]FormModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={editing[ComponentName] ? t("common.edit") + " " + t("[componentName].[componentName]") : t("common.addNew") + " " + t("[componentName].[componentName]")}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      centered
      maskClosable={false}
      width={800}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
    >
      <Form form={form} layout="vertical" className="mt-4">
        //Create form here
      </Form>
    </Modal>
  );
};