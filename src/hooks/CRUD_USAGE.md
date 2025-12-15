# Generic CRUD Hook - Usage Examples

## Overview

This document shows how to use the generic `useCrudManagement` hook for different entities.

---

## User Management (Implemented)

```tsx
// src/pages/users/UserList.tsx
import { useCrudManagement } from "@/hooks/useCrudManagement";
import { mockApi } from "@/services/mock";

const crud = useCrudManagement<UserData>({
  apiService: {
    getAll: mockApi.user.getUsers,
    create: mockApi.user.createUser,
    update: mockApi.user.updateUser,
    delete: mockApi.user.deleteUser
  },
  entityName: "User"
});
```

---

## Product Management (Example)

```tsx
// src/pages/products/ProductList.tsx
import { useCrudManagement } from "@/hooks/useCrudManagement";
import { mockApi } from "@/services/mock";

interface ProductData {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive";
}

export const ProductList = () => {
  const crud = useCrudManagement<ProductData>({
    apiService: {
      getAll: mockApi.product.getProducts,
      create: mockApi.product.createProduct,
      update: mockApi.product.updateProduct,
      delete: mockApi.product.deleteProduct
    },
    entityName: "Product",
    onView: (product) => navigate(`/products/${product.id}`) // Custom view handler
  });

  // Use crud.data, crud.handleAdd, crud.handleEdit, etc.
  return <ProductListUI {...crud} />;
};
```

---

## Order Management (Example)

```tsx
// src/pages/orders/OrderList.tsx
interface OrderData {
  id: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
}

export const OrderList = () => {
  const crud = useCrudManagement<OrderData>({
    apiService: mockApi.order,
    entityName: "Order"
  });

  return <OrderListUI {...crud} />;
};
```

---

## Category Management (Example)

```tsx
// src/pages/categories/CategoryList.tsx
const crud = useCrudManagement({
  apiService: mockApi.category,
  entityName: "Category"
});
```

---

## Benefits

✅ **One hook for all** - No duplicate code
✅ **Type-safe** - Full TypeScript support
✅ **Consistent** - Same behavior everywhere
✅ **Flexible** - Custom handlers supported

---

## API Service Interface

Your API service should implement:

```tsx
interface CrudApiService<T> {
  getAll?: (page, pageSize, search) => Promise<Response>;
  create: (data) => Promise<Response>;
  update: (id, data) => Promise<Response>;
  delete: (id) => Promise<Response>;
}
```

---

## Returned Values

The hook returns:

```tsx
{
  // State
  (data, // Array of items
    searchText, // Current search text
    loading, // Loading state
    isModalOpen, // Modal visibility
    editingItem, // Item being edited
    form, // Ant Design form instance
    pagination, // Pagination state
    // Actions
    setSearchText, // Update search
    handleAdd, // Open create modal
    handleEdit, // Open edit modal
    handleDelete, // Delete item
    handleView, // View item
    handleTableChange, // Handle pagination
    handleModalOk, // Submit form
    handleModalCancel, // Cancel form
    // Utils
    refresh); // Manually refresh data
}
```
