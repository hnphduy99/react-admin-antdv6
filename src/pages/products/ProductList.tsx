import { productApi } from "@/apis/product.api";
import { ExportExcel, TableWithPagination } from "@/components/common";
import { TopSearchBar } from "@/components/filters/TopSearchBar";
import PageTitle from "@/components/PageTitle/PageTitle";
import { useCrudManagement } from "@/hooks/useCrudManagement";
import type { IProduct } from "@/interfaces/product.interface";
import { getPermissionByResource } from "@/utils/permissions";
import { getTopSearchConfigs } from "@/utils/tableSearchHelper";
import { AppstoreOutlined, DollarOutlined, InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Space, Statistic } from "antd";
import { useTranslation } from "react-i18next";
import { createProductColumns } from "./productColumns";

export const ProductList = () => {
  const { t } = useTranslation();

  const actions = getPermissionByResource("products", true);
  const canViewTable = actions?.index;
  const canCreate = actions?.create;
  const canUpdate = actions?.edit;
  const canDelete = actions?.delete;
  const canView = actions?.show;
  const canExport = actions?.export;

  const {
    data,
    loading,
    pagination,
    handleColumnSearch,
    handleBulkColumnSearch,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleTableChange
  } = useCrudManagement<IProduct>({
    apiService: {
      getAll: productApi.getProductList,
      delete: productApi.deleteProduct
    },
    entityName: "Product",
    mode: "page",
    basePath: "/products"
  });

  const columns = createProductColumns(t, handleView, handleEdit, handleDelete, handleColumnSearch, pagination, {
    canUpdate,
    canDelete,
    canView
  });
  const topSearchConfigs = getTopSearchConfigs(columns);

  // Calculate statistics
  const totalValue = data.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalStock = data.reduce((sum, p) => sum + p.stock, 0);
  const totalProducts = pagination.total;

  return (
    <>
      <PageTitle>{t("product.productManagement")}</PageTitle>

      <div className="space-y-4">
        {/* Statistics Cards */}
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm">
              <Statistic
                title={t("product.totalProducts", { count: totalProducts })}
                value={totalProducts}
                prefix={<AppstoreOutlined />}
                styles={{ content: { color: "#3f8600" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm">
              <Statistic
                title={t("product.totalProducts", { count: totalStock })}
                value={totalStock}
                prefix={<InboxOutlined />}
                suffix={t("product.units")}
                styles={{ content: { color: "#1890ff" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card className="shadow-sm">
              <Statistic
                title={t("product.inventoryValue")}
                value={totalValue}
                prefix={<DollarOutlined />}
                precision={2}
                styles={{ content: { color: "#cf1322" } }}
              />
            </Card>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-bold m-0 uppercase">{t("product.productManagement")}</h2>
            <Space>
              {canExport && <ExportExcel columns={columns} dataSource={data} fileName="Danh_sach_san_pham" t={t} />}
              {canCreate && (
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                  {t("common.addNew")}
                </Button>
              )}
            </Space>
          </div>

          {canViewTable && (
            <>
              <TopSearchBar configs={topSearchConfigs} onSearch={handleBulkColumnSearch} />

              <TableWithPagination
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id"
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: 1000, y: "calc(100vh - 465px)" }}
              />
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default ProductList;
