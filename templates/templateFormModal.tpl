import type { I[ComponentName] } from "@/interfaces/[componentName].interface";
import { Form, Modal, type FormInstance } from "antd";
import type { TFunction } from "i18next";

interface [ComponentName]FormModalProps {
  t: TFunction<"translation", undefined>;
  open: boolean;
  editingItem: I[ComponentName] | null;
  loading: boolean;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
}

export const [ComponentName]FormModal = ({ t, open, editingItem, loading, form, onOk, onCancel }: [ComponentName]FormModalProps) => {
  return (
    <Modal
      title={editingItem ? `${t("common.edit")} ${t("[componentName].[componentName]")}` : `${t("common.addNew")} ${t("[componentName].[componentName]")}`}
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
      <Form form={form} layout="vertical">
        //Create form here
      </Form>
    </Modal>
  );
};
