import { productApi } from "@/apis/product.api";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useCrudManagement } from "@/hooks/useCrudManagement";
import type { IProduct } from "@/interfaces/product.interface";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

export const ProductFormPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const { form, loading, handleEdit, handleModalOk } = useCrudManagement<IProduct>({
    apiService: {
      getById: productApi.getProductById,
      create: productApi.createProduct,
      update: productApi.updateProduct
    },
    entityName: "Product",
    mode: "page",
    basePath: "/products"
  });

  useEffect(() => {
    if (id) {
      handleEdit(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onFinish = async () => {
    await handleModalOk();
    // After success, handleModalOk closes modal, but here we might want to navigate back
    // However, handleModalOk in useCrudManagement is designed for modals (calls setIsModalOpen(false))
    // We might need to handle navigation manually or update handleModalOk
  };

  return (
    <>
      <PageTitle>
        {isEdit ? t("common.edit") : t("common.addNew")} {t("product.product")}
      </PageTitle>

      <Card
        title={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
            <span>
              {isEdit ? t("common.edit") : t("common.addNew")} {t("product.product")}
            </span>
          </Space>
        }
        className="shadow-sm"
      >
        <Form form={form} layout="vertical" onFinish={onFinish} disabled={loading}>
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

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => navigate(-1)}>{t("common.cancel")}</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                {t("common.save")}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ProductFormPage;
