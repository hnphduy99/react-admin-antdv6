# Server-Side Search Implementation Guide

## Overview

Full server-side search system with:

- Global search box (debounced)
- Column-level filters (text, number range, select)
- All trigger API calls

---

## Components

### 1. `useCrudManagement` Hook

Core hook that handles all CRUD + search operations.

**Key Features:**

- Global search via `handleSearch(value)`
- Column search via `handleColumnSearch(value, column)`
- Automatic API calls with filters
- State management for searches

**Usage:**

```tsx
const {
  data,
  loading,
  searchText,
  setSearchText,
  handleSearch, // Global search
  handleColumnSearch // Column search
  // ... other CRUD methods
} = useCrudManagement<Product>({
  apiService: {
    getAll: mockApi.product.getProducts,
    create: mockApi.product.createProduct,
    update: mockApi.product.updateProduct,
    delete: mockApi.product.deleteProduct
  },
  entityName: "Product"
});
```

### 2. `useDebounce` Hook

Custom hook for debouncing function calls.

**Usage:**

```tsx
import { useDebounce } from "@/hooks/useDebounce";

const debouncedSearch = useDebounce(handleSearch, 500);

// In input onChange
onChange={(e) => {
  setSearchText(e.target.value);  // Instant UI update
  debouncedSearch(e.target.value); // Debounced API call
}}
```

---

## Search Flow

### Global Search

```
User types in search box
  ↓
setSearchText(value) - instant UI update
  ↓
debouncedSearch(value) - wait 500ms
  ↓
handleSearch(value)
  ↓
fetchData(page, pageSize, value, columnSearches)
  ↓
API call with search param
  ↓
Update data state
```

### Column Search

```
User clicks column filter icon
  ↓
Opens filter dropdown
  ↓
User fills input/selects option
  ↓
Clicks "Search" button
  ↓
handleColumnSearch(value, column)
  ↓
Updates columnSearches state
  ↓
fetchData(page, pageSize, searchText, updatedColumnSearches)
  ↓
API call with column filters
  ↓
Update data state
```

---

## API Integration

### API Service Interface

```tsx
interface CrudApiService<T> {
  getAll?: (
    page: number,
    pageSize: number,
    search?: string,
    columnSearches?: Record<string, string>
  ) => Promise<ApiResponse>;
  // ... other methods
}
```

### Example Implementation

```tsx
// mockApi.ts
async getProducts(
  page: number,
  pageSize: number,
  search?: string,
  columnSearches?: Record<string, string>
) {
  let filtered = [...mockProducts];

  // Global search
  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Column filters
  if (columnSearches) {
    // Text filter
    if (columnSearches.name) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(columnSearches.name.toLowerCase())
      );
    }

    // Number range filter (format: "min-max")
    if (columnSearches.price) {
      const [min, max] = columnSearches.price.split('-');
      filtered = filtered.filter(p => {
        const minOk = !min || p.price >= Number(min);
        const maxOk = !max || p.price <= Number(max);
        return minOk && maxOk;
      });
    }

    // Select filter
    if (columnSearches.category) {
      filtered = filtered.filter(p =>
        p.category === columnSearches.category
      );
    }
  }

  // Pagination
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedData = filtered.slice(start, end);

  return {
    success: true,
    data: {
      data: paginatedData,
      page,
      pageSize,
      total: filtered.length
    }
  };
}
```

---

## Component Integration

### Example: ProductList

```tsx
export const ProductList = () => {
  const { t } = useTranslation();

  const {
    data,
    searchText,
    setSearchText,
    handleSearch,
    handleColumnSearch // Pass to columns
    // ... other methods
  } = useCrudManagement<Product>({
    apiService: {
      getAll: mockApi.product.getProducts
    },
    entityName: "Product"
  });

  // Debounce for global search
  const debouncedSearch = useDebounce(handleSearch, 500);

  // Create columns with search handler
  const columns = createProductColumns(
    t,
    handleView,
    handleEdit,
    handleDelete,
    handleColumnSearch // Required!
  );

  return (
    <div>
      {/* Global search */}
      <Input
        placeholder={t("product.searchPlaceholder")}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          debouncedSearch(e.target.value);
        }}
      />

      {/* Table with column filters */}
      <Table columns={columns} dataSource={data} />
    </div>
  );
};
```

---

## Benefits

✅ **Scalable** - Works with large datasets
✅ **Performant** - Server handles filtering
✅ **Flexible** - Combine global + column search
✅ **Debounced** - Reduces unnecessary API calls
✅ **Type-Safe** - Full TypeScript support

---

## Related Files

- [`useCrudManagement.ts`](./useCrudManagement.ts) - Main CRUD hook
- [`useDebounce.ts`](./useDebounce.ts) - Debounce utility
- [`tableSearchHelper.tsx`](../utils/tableSearchHelper.tsx) - Column filter helpers
- [`COLUMN_FILTERS_GUIDE.md`](../utils/COLUMN_FILTERS_GUIDE.md) - Column filters documentation
