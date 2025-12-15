import { Modal, Form, Input, Select, InputNumber, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import type { Product } from "@/types";

const { Option } = Select;
const { TextArea } = Input;

interface ProductFormModalProps {
  open: boolean;
  editingProduct: Product | null;
  loading: boolean;
  form: any;
  onOk: () => void;
  onCancel: () => void;
}

export const ProductFormModal = ({ open, editingProduct, loading, form, onOk, onCancel }: ProductFormModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      title={editingProduct ? "Edit Product" : "Add New Product"}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={700}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Please input product name!" }]}
            >
              <Input placeholder="e.g. iPhone 15 Pro" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select placeholder="Select category">
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
              label="Price ($)"
              rules={[
                { required: true, message: "Please input price!" },
                { type: "number", min: 0, message: "Price must be positive!" }
              ]}
            >
              <InputNumber min={0} precision={2} prefix="$" style={{ width: "100%" }} placeholder="0.00" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="stock"
              label="Stock Quantity"
              rules={[
                { required: true, message: "Please input stock!" },
                { type: "number", min: 0, message: "Stock must be positive!" }
              ]}
            >
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Enter product description..." showCount maxLength={500} />
        </Form.Item>

        <Form.Item name="status" label="Status" initialValue="active" rules={[{ required: true }]}>
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
