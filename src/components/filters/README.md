# Filter Components Documentation

Custom React components for table column filtering with server-side support.

---

## Components

### 1. NumberRangeFilter

Filter for numeric columns with min/max inputs.

**Location**: `@/components/filters/NumberRangeFilter`

**Props:**

```tsx
interface NumberRangeFilterProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
  close: () => void;
  placeholder?: { min?: string; max?: string };
  onSearch: (min: number | null, max: number | null) => void;
  onReset: () => void;
}
```

**Features:**

- Two InputNumber fields (min/max)
- Search button triggers `onSearch`
- Reset clears both inputs
- Close button

**Used by:** `getColumnNumberRangeProps`

---

### 2. SelectFilter

Filter for categorical columns with static options.

**Location**: `@/components/filters/SelectFilter`

**Props:**

```tsx
interface SelectFilterProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
  close: () => void;
  placeholder?: string;
  options: Array<{ label: string; value: string | number }>;
  onSearch: (value: string) => void;
  onReset: () => void;
}
```

**Features:**

- Ant Design Select component
- Search within options
- Clear selection
- Predefined options

**Used by:** `getColumnSelectProps`

---

### 3. AsyncSelectFilter

Filter with API-loaded options.

**Location**: `@/components/filters/AsyncSelectFilter`

**Props:**

```tsx
interface AsyncSelectFilterProps {
  setSelectedKeys: (keys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param?: FilterConfirmProps) => void;
  clearFilters?: () => void;
  close: () => void;
  placeholder?: string;
  fetchOptions: () => Promise<Array<{ label: string; value: string | number }>>;
  onSearch: (value: string) => void;
  onReset: () => void;
}
```

**Features:**

- Async data loading
- Loading indicator
- Error handling
- Search within loaded options

**Used by:** `getColumnAsyncSelectProps`

---

## Usage

These components are **not used directly**. They are wrapped by helper functions in `tableSearchHelper.tsx`:

```tsx
// Don't use directly ❌
<NumberRangeFilter {...props} />

// Use via helper ✅
...getColumnNumberRangeProps({ dataIndex: "price", ... })
```

---

## Implementation Pattern

All filter components follow this pattern:

1. **Receive props** from Ant Design Table filterDropdown
2. **Manage local state** (if needed)
3. **Call onSearch** when user clicks Search
4. **Call onReset** when user clicks Reset
5. **Return JSX** for filter UI

### Example:

```tsx
export const NumberRangeFilter: React.FC<Props> = ({ confirm, clearFilters, close, onSearch, onReset }) => {
  const [min, setMin] = useState<number | null>(null);
  const [max, setMax] = useState<number | null>(null);

  const handleSearch = () => {
    confirm();
    onSearch(min, max);
  };

  const handleReset = () => {
    setMin(null);
    setMax(null);
    clearFilters?.();
    onReset();
  };

  return (
    <div style={{ padding: 8 }}>
      <InputNumber value={min} onChange={setMin} />
      <InputNumber value={max} onChange={setMax} />
      <Button onClick={handleSearch}>Search</Button>
      <Button onClick={handleReset}>Reset</Button>
    </div>
  );
};
```

---

## Why Separate Components?

**Problem**: React Hooks cannot be used inside `filterDropdown` render function.

**Solution**: Extract filter UI into proper React components, then reference them in helpers.

**Benefits:**

- ✅ Can use React Hooks (useState, useEffect)
- ✅ Clean separation of concerns
- ✅ Reusable and testable
- ✅ Type-safe

---

## Related Files

- [`tableSearchHelper.tsx`](../utils/tableSearchHelper.tsx) - Helper functions
- [`COLUMN_FILTERS_GUIDE.md`](../utils/COLUMN_FILTERS_GUIDE.md) - Usage guide
