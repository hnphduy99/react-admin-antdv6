import type { IProduct } from "@/interfaces/product.interface";
import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { TextArea } = Input;

interface ProductFormModalProps {
  open: boolean;
  editingProduct: IProduct | null;
  loading: boolean;
  form: any;
  onOk: () => void;
  onCancel: () => void;
}

export const ProductFormModal = ({ open, editingProduct, loading, form, onOk, onCancel }: ProductFormModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={
        editingProduct ? t("common.edit") + " " + t("product.product") : t("common.addNew") + " " + t("product.product")
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      centered
      maskClosable={false}
      width={700}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label={t("product.productName")}
              rules={[{ required: true, message: t("validation.nameRequired") }]}
            >
              <Input placeholder="e.g. iPhone 15 Pro" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label={t("product.category")}
              rules={[{ required: true, message: t("validation.categoryRequired") }]}
            >
              <Select placeholder={t("common.select")}>
                <Option value="Electronics">Electronics</Option>
                <Option value="Clothing">Clothing</Option>
                <Option value="Food">Food</Option>
                <Option value="Books">Books</Option>
                <Option value="Home & Garden">Home & Garden</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="price"
              label={t("product.price")}
              rules={[
                { required: true, message: t("validation.priceRequired") },
                { type: "number", min: 0, message: t("validation.pricePositive") }
              ]}
            >
              <InputNumber min={0} precision={2} prefix="$" style={{ width: "100%" }} placeholder="0.00" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stock"
              label={t("product.stock")}
              rules={[
                { required: true, message: t("validation.stockRequired") },
                { type: "number", min: 0, message: t("validation.stockPositive") }
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label={t("product.description")}>
          <TextArea rows={4} placeholder={t("product.descriptionPlaceholder")} showCount maxLength={500} />
        </Form.Item>

        <Form.Item name="status" label={t("table.status")} initialValue="active" rules={[{ required: true }]}>
          <Select>
            <Option value="active">{t("table.active")}</Option>
            <Option value="inactive">{t("table.inactive")}</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
