# CRUD Module Creation Guide

## Hướng dẫn tạo một CRUD Module mới hoàn chỉnh

---

## Tổng quan

Để tạo một CRUD module mới (ví dụ: Product Management), bạn cần:

- **5 files** chính
- **~150-200 dòng code** tổng cộng
- **~30 phút** để hoàn thành

---

## Checklist

### ✅ Bước 1: Tạo Interface & Types (5 phút)

**File:** `src/types/index.ts` (hoặc entity-specific file)

```tsx
// Thêm interface cho entity mới
export interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt?: string;
}
```

**Checklist:**

- [ ] Define interface với tất cả fields cần thiết
- [ ] Đảm bảo có field `id: string` (required cho generic hook)
- [ ] Sử dụng union types cho fields có giá trị cố định (status, role, etc.)
- [ ] Optional fields dùng `?`

---

### ✅ Bước 2: Tạo Mock API Service (15 phút)

**File:** `src/services/mock.ts`

```tsx
// 1. Generate mock data
const generateMockProducts = () => {
  const products = [];
  for (let i = 1; i <= 50; i++) {
    products.push({
      id: `${i}`,
      name: `Product ${i}`,
      price: Math.floor(Math.random() * 1000) + 10,
      stock: Math.floor(Math.random() * 100),
      category: ["Electronics", "Clothing", "Food"][i % 3],
      status: i % 5 === 0 ? "inactive" : "active",
      createdAt: new Date().toISOString()
    });
  }
  return products;
};

// 2. In-memory storage
const productDataStore = generateMockProducts();

// 3. API methods
export const mockProductApi = {
  getProducts: async (page: number = 1, pageSize: number = 10, search?: string) => {
    await delay(600);

    let filteredData = [...productDataStore];

    if (search) {
      filteredData = filteredData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(start, start + pageSize);

    return {
      success: true,
      data: { data: paginatedData, total, page, pageSize }
    };
  },

  createProduct: async (data: any) => {
    await delay(700);
    const newProduct = {
      id: `${productDataStore.length + 1}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    productDataStore.push(newProduct);
    return { success: true, data: newProduct, message: "Product created" };
  },

  updateProduct: async (id: string, data: any) => {
    await delay(600);
    const index = productDataStore.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    productDataStore[index] = { ...productDataStore[index], ...data };
    return { success: true, data: productDataStore[index], message: "Product updated" };
  },

  deleteProduct: async (id: string) => {
    await delay(500);
    const index = productDataStore.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");

    productDataStore.splice(index, 1);
    return { success: true, message: "Product deleted" };
  }
};

// 4. Export trong mockApi object
export const mockApi = {
  // ... existing
  product: mockProductApi // ← Add this
};
```

**Checklist:**

- [ ] Generate mock data function
- [ ] In-memory data store
- [ ] `getAll` method với pagination & search
- [ ] `create` method
- [ ] `update` method
- [ ] `delete` method
- [ ] Export trong `mockApi` object

---

### ✅ Bước 3: Tạo Table Columns Config (10 phút)

**File:** `src/pages/products/config/productColumns.tsx`

```tsx
import { Button, Space, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive";
}

export const createProductColumns = (
  t: any,
  handleView: (record: ProductData) => void,
  handleEdit: (record: ProductData) => void,
  handleDelete: (id: string) => void
): ColumnsType<ProductData> => [
  {
    title: t("table.name"),
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.price - b.price,
    render: (price) => `$${price.toFixed(2)}`
  },
  {
    title: "Stock",
    dataIndex: "stock",
    key: "stock",
    sorter: (a, b) => a.stock - b.stock
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    filters: [
      { text: "Electronics", value: "Electronics" },
      { text: "Clothing", value: "Clothing" },
      { text: "Food", value: "Food" }
    ],
    onFilter: (value, record) => record.category === value
  },
  {
    title: t("table.status"),
    dataIndex: "status",
    key: "status",
    render: (status) => <Tag color={status === "active" ? "green" : "default"}>{status.toUpperCase()}</Tag>
  },
  {
    title: t("common.actions"),
    key: "action",
    render: (_, record) => (
      <Space>
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>
          View
        </Button>
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit
        </Button>
        <Popconfirm title="Delete this product?" onConfirm={() => handleDelete(record.id)}>
          <Button type="link" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      </Space>
    )
  }
];
```

**Checklist:**

- [ ] Create columns factory function
- [ ] Add all relevant columns
- [ ] Add sorters where needed
- [ ] Add filters where needed
- [ ] Add custom renderers (Tags, formats, etc.)
- [ ] Add actions column với View/Edit/Delete

---

### ✅ Bước 4: Tạo Form Modal Component (10 phút)

**File:** `src/pages/products/components/ProductFormModal.tsx`

```tsx
import { Modal, Form, Input, Select, InputNumber, Row, Col } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const { TextArea } = Input;

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  status: "active" | "inactive";
}

interface ProductFormModalProps {
  open: boolean;
  editingProduct: ProductData | null;
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
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Product Name"
              rules={[{ required: true, message: "Please input product name!" }]}
            >
              <Input placeholder="Enter product name" />
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
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="price" label="Price" rules={[{ required: true, message: "Please input price!" }]}>
              <InputNumber min={0} prefix="$" style={{ width: "100%" }} placeholder="0.00" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="stock" label="Stock" rules={[{ required: true, message: "Please input stock!" }]}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Enter product description" />
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
```

**Checklist:**

- [ ] Create Modal component
- [ ] Add Form with all fields
- [ ] Add validation rules
- [ ] Use appropriate input types (Input, InputNumber, Select, DatePicker, etc.)
- [ ] Set initialValue cho fields có default
- [ ] Add placeholder texts

---

### ✅ Bước 5: Tạo Main List Component (10 phút)

**File:** `src/pages/products/ProductList.tsx`

```tsx
import { Card, Table, Button, Input, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useCrudManagement } from "@/hooks/useCrudManagement";
import { mockApi } from "@/services/mock";
import { createProductColumns } from "./config/productColumns";
import { ProductFormModal } from "./components/ProductFormModal";

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive";
}

export const ProductList = () => {
  const { t } = useTranslation();

  const {
    data,
    searchText,
    loading,
    isModalOpen,
    editingItem,
    form,
    pagination,
    setSearchText,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleTableChange,
    handleModalOk,
    handleModalCancel
  } = useCrudManagement<ProductData>({
    apiService: {
      getAll: mockApi.product.getProducts,
      create: mockApi.product.createProduct,
      update: mockApi.product.updateProduct,
      delete: mockApi.product.deleteProduct
    },
    entityName: "Product"
  });

  const columns = createProductColumns(t, handleView, handleEdit, handleDelete);

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold m-0">Product List</h2>
          <Space>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Product
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
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
```

**Checklist:**

- [ ] Import generic `useCrudManagement` hook
- [ ] Configure với API service
- [ ] Pass entityName
- [ ] Create columns
- [ ] Render Card + Table
- [ ] Render Modal
- [ ] Add search input
- [ ] Add "Add New" button

---

### ✅ Bước 6: Add Route (2 phút)

**File:** `src/routes/index.tsx`

```tsx
import { ProductList } from "@/pages/products/ProductList";

// Thêm route mới
{
  path: "/products",
  element: <ProductList />
}
```

---

### ✅ Bước 7: Add Menu Item (2 phút)

**File:** `src/layouts/Main/Sider/sidebarNavigation.tsx`

```tsx
{
  key: "products",
  icon: <ShoppingOutlined />,
  label: "Products",
  path: "/products"
}
```

---

## Quick Reference Checklist

Khi tạo CRUD mới, hoàn thành theo thứ tự:

```
□ 1. Define interface trong src/types/index.ts
□ 2. Create mock API trong src/services/mock.ts
    □ Generate data function
    □ Data store
    □ getAll, create, update, delete methods
    □ Export trong mockApi
□ 3. Create columns config (config/entityColumns.tsx)
□ 4. Create form modal (components/EntityFormModal.tsx)
□ 5. Create list component (EntityList.tsx)
    □ Use useCrudManagement hook
    □ Pass API service config
    □ Render table + modal
□ 6. Add route
□ 7. Add menu item
```

---

## File Structure Template

```
src/pages/[entity]/
├── [Entity]List.tsx              # Main component
├── components/
│   └── [Entity]FormModal.tsx     # Create/Edit modal
└── config/
    └── [entity]Columns.tsx       # Table config
```

---

## Tips & Best Practices

### ✅ DO

- Copy từ existing CRUD (User) làm template
- Đổi tên entity nhất quán (Product → product)
- Sử dụng TypeScript interfaces
- Add validation rules đầy đủ
- Test search và pagination

### ❌ DON'T

- Hardcode values - dùng constants/enums
- Skip validation rules
- Quên export trong mockApi
- Copy/paste mà không đổi tên

---

## Estimated Time

| Step              | Time        |
| ----------------- | ----------- |
| 1. Interface      | 5 min       |
| 2. Mock API       | 15 min      |
| 3. Columns        | 10 min      |
| 4. Form Modal     | 10 min      |
| 5. List Component | 10 min      |
| 6. Route          | 2 min       |
| 7. Menu           | 2 min       |
| **Total**         | **~50 min** |

Với practice, có thể giảm xuống **30 phút**!

---

## Example Entities You Can Create

- 📦 Products (Sản phẩm)
- 📋 Orders (Đơn hàng)
- 👥 Customers (Khách hàng)
- 📁 Categories (Danh mục)
- 📄 Invoices (Hóa đơn)
- 📊 Reports (Báo cáo)
- ⚙️ Settings (Cài đặt)
- 📢 Notifications (Thông báo)
- 📝 Posts/Articles (Bài viết)
- 🏷️ Tags (Thẻ)

---

## Need Help?

Xem các ví dụ có sẵn:

- [UserList](file:///Users/huynhduy/Documents/code/core/react-admin/src/pages/users/UserList.tsx) - Complete example
- [useCrudManagement](file:///Users/huynhduy/Documents/code/core/react-admin/src/hooks/useCrudManagement.ts) - Generic hook
- [CRUD_USAGE.md](file:///Users/huynhduy/Documents/code/core/react-admin/src/hooks/CRUD_USAGE.md) - Usage examples
