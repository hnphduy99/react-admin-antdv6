# Column Filters - Complete Guide

## Overview

Enhanced column filtering system supports 4 filter types, all with **server-side filtering**:

1. **Text Search** - Search by text input
2. **Number Range** - Min/max filtering for numbers
3. **Select Dropdown** - Static option selection
4. **Async Select** - API-loaded options

---

## Available Filter Helpers

All helpers are exported from `@/utils/tableSearchHelper`.

### 1. `getColumnInputProps<T>()` - Text Search

For searching text columns like names, emails, descriptions.

```tsx
import { getColumnInputProps } from "@/utils/tableSearchHelper";

{
  title: "Name",
  dataIndex: "name",
  ...getColumnInputProps<UserData>({
    dataIndex: "name",
    placeholder: "Search name",
    onSearch: handleColumnSearch
  })
}
```

### 2. `getColumnNumberRangeProps<T>()` - Number Range

For filtering numeric columns with min/max values (price, age, quantity).

```tsx
import { getColumnNumberRangeProps } from "@/utils/tableSearchHelper";

{
  title: "Price",
  dataIndex: "price",
  ...getColumnNumberRangeProps<Product>({
    dataIndex: "price",
    placeholder: { min: "Min price", max: "Max price" },
    onSearch: handleColumnSearch
  })
}
```

### 3. `getColumnSelectProps<T>()` - Select Dropdown

For filtering with predefined static options (role, status, category).

```tsx
import { getColumnSelectProps } from "@/utils/tableSearchHelper";

{
  title: "Role",
  dataIndex: "role",
  ...getColumnSelectProps<User>({
    dataIndex: "role",
    placeholder: "Select role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
      { label: "Moderator", value: "moderator" }
    ],
    onSearch: handleColumnSearch
  })
}
```

### 4. `getColumnAsyncSelectProps<T>()` - Async Select

For filtering with dynamic options loaded from API.

```tsx
import { getColumnAsyncSelectProps } from "@/utils/tableSearchHelper";

{
  title: "Category",
  dataIndex: "category",
  ...getColumnAsyncSelectProps<Product>({
    dataIndex: "category",
    placeholder: "Select category",
    fetchOptions: async () => {
      const res = await api.getCategories();
      return res.data.map(c => ({
        label: c.name,
        value: c.id
      }));
    },
    onSearch: handleColumnSearch
  })
}
```

---

## Complete Example

```tsx
// productColumns.tsx
import { getColumnInputProps, getColumnNumberRangeProps } from "@/utils/tableSearchHelper";

export const createProductColumns = (
  t: any,
  handleView: (record: Product) => void,
  handleEdit: (record: Product) => void,
  handleDelete: (id: string) => void,
  handleColumnSearch: (value: string, column: string) => void // Required!
): ColumnsType<Product> => [
  {
    title: t("product.productName"),
    dataIndex: "name",
    // Text search
    ...getColumnInputProps<Product>({
      dataIndex: "name",
      placeholder: t("product.searchProduct"),
      onSearch: handleColumnSearch
    })
  },
  {
    title: t("product.price"),
    dataIndex: "price",
    // Number range filter
    ...getColumnNumberRangeProps<Product>({
      dataIndex: "price",
      placeholder: {
        min: t("product.minPrice"),
        max: t("product.maxPrice")
      },
      onSearch: handleColumnSearch
    }),
    render: (price) => `$${price.toFixed(2)}`
  }
];
```

---

## How It Works

### Server-Side Filtering

All filters call `handleColumnSearch(value, column)` from `useCrudManagement` which:

1. Updates `columnSearches` state
2. Calls API with `fetchData(page, pageSize, searchText, columnSearches)`
3. Server filters data and returns results

### API Signature

Your API service should accept:

```tsx
getAll(
  page: number,
  pageSize: number,
  search?: string,              // Global search
  columnSearches?: Record<string, string> // Column-specific filters
): Promise<ApiResponse>
```

### Filter Value Formats

- **Text**: `"john"`
- **Number Range**: `"100-500"` (min-max) or `"100-"` (min only) or `"-500"` (max only)
- **Select**: `"admin"`
- **Async Select**: `"category-id"`

---

## Quick Reference

| Filter Type  | Helper                      | Use Case                       |
| ------------ | --------------------------- | ------------------------------ |
| Text         | `getColumnInputProps`       | Names, emails, descriptions    |
| Number Range | `getColumnNumberRangeProps` | Price, age, quantity, stock    |
| Select       | `getColumnSelectProps`      | Role, status, fixed categories |
| Async Select | `getColumnAsyncSelectProps` | Dynamic data from API          |

---

## Important Notes

✅ Always pass `handleColumnSearch` from `useCrudManagement` to column config
✅ All filters trigger server-side API calls
✅ Filters work with global search simultaneously
✅ Fully i18n compatible
