import CustomTable from "@/components/customize/CustomTable";
import { useCrudManagement } from "@/hooks/useCrudManagement";
import { useDebounce } from "@/hooks/useDebounce";
import { mockApi } from "@/services/mock";
import type { Product } from "@/types";
import { AppstoreOutlined, DollarOutlined, InboxOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Space, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { createProductColumns } from "./productColumns";
import { ProductFormModal } from "./ProductFormModal";

export const ProductList = () => {
  const { t } = useTranslation();

  // Use generic CRUD hook with Product-specific config
  const {
    data,
    searchText,
    loading,
    isModalOpen,
    editingItem,
    form,
    pagination,
    setSearchText,
    handleSearch,
    handleColumnSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleTableChange,
    handleModalOk,
    handleModalCancel
  } = useCrudManagement<Product>({
    apiService: {
      getAll: mockApi.product.getProducts,
      create: mockApi.product.createProduct,
      update: mockApi.product.updateProduct,
      delete: mockApi.product.deleteProduct
    },
    entityName: "Product"
  });

  // Debounced search handler
  const debouncedSearch = useDebounce(handleSearch, 500);

  const columns = createProductColumns(t, handleView, handleEdit, handleDelete, handleColumnSearch, pagination);

  // Calculate statistics
  const totalValue = data.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalStock = data.reduce((sum, p) => sum + p.stock, 0);
  const totalProducts = pagination.total;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t("product.totalProducts", { count: totalProducts })}
              value={totalProducts}
              prefix={<AppstoreOutlined />}
              styles={{
                content: {
                  color: "#3f8600"
                }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t("product.totalProducts", { count: totalStock })}
              value={totalStock}
              prefix={<InboxOutlined />}
              suffix={t("product.units")}
              styles={{
                content: {
                  color: "#1890ff"
                }
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title={t("product.inventoryValue")}
              value={totalValue}
              prefix={<DollarOutlined />}
              precision={2}
              styles={{
                content: {
                  color: "#cf1322"
                }
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold m-0">
            <AppstoreOutlined className="mr-2" />
            {t("product.productManagement")}
          </h2>
          <Space>
            <Input
              placeholder={t("product.searchPlaceholder")}
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                debouncedSearch(e.target.value);
              }}
              className="w-64"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              {t("product.addProduct")}
            </Button>
          </Space>
        </div>

        <CustomTable
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={pagination}
          onChange={handleTableChange}
          scroll={{ x: 1000, y: "calc(100vh - 465px)" }}
        />
      </Card>

      <ProductFormModal
        open={isModalOpen}
        editingProduct={editingItem}
        loading={loading}
        form={form}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      />
    </div>
  );
};
