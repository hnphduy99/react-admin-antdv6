import ActionFilter from "@/components/filters/ActionFilter";
import { InputFilter } from "@/components/filters/InputFilter";
import { SelectFilter } from "@/components/filters/SelectFilter";
import { AsyncSelectFilter } from "@/components/filters/AsyncSelectFilter";
import { NumberRangeFilter } from "@/components/filters/NumberRangeFilter";
import { SearchOutlined } from "@ant-design/icons";

import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import { DateTimeFilter } from "@/components/filters/DateTimeFilter";
import { Card, Flex } from "antd";
import { DateTimeFilterAdvanced } from "@/components/filters/DateTimeFilterAdvanced";
import { NumberRangeFilterAdvanced } from "@/components/filters/NumberRangeFilterAdvanced";

/* -----------------------------------------------------------
COMMON
----------------------------------------------------------- */

// Định nghĩa các loại operator
export type TextOperator = "contain" | "equal" | "start_with" | "end_with";
export type NumberOperator = "equal" | "not_equal" | "<" | ">" | "<=" | ">=" | "between";
export type DateOperator = "equal" | "<" | ">" | "<=" | ">=" | "between";
export type SelectOperator = "equal" | "not_equal" | "in";

export type SearchOperator = TextOperator | NumberOperator | DateOperator | SelectOperator;

// Cấu trúc giá trị search với operator
export interface ColumnSearchValue {
  value: any;
  operator: SearchOperator;
}

export interface TopSearchConfig {
  dataIndex: string;
  type: "input" | "select" | "date" | "dateRange";
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  operator?: SearchOperator;
}

export type SearchDisplayMode = "top" | "column" | "both";

interface GetCommonFilterParams<T> {
  dataIndex: keyof T | string;
  placeholder?: string;
  onSearch: (value: ColumnSearchValue | null, dataIndex: string) => void;
  operator?: SearchOperator;
  showSearch?: SearchDisplayMode;
}

function createHandlers(
  dataIndex: string,
  onSearch: (v: ColumnSearchValue | null, d: string) => void,
  defaultOperator: SearchOperator = "contain"
) {
  return {
    onSearch: (confirm: (p?: FilterConfirmProps) => void, value: any, operator?: SearchOperator) => {
      confirm();
      if (!value || value === "" || (typeof value === "object" && !value.value)) {
        onSearch(null, dataIndex);
      } else {
        onSearch(
          {
            value: value,
            operator: operator || defaultOperator
          },
          dataIndex
        );
      }
    },

    onReset: (confirm: (p?: FilterConfirmProps) => void, setSelectedKeys: (k: React.Key[]) => void) => {
      setSelectedKeys([]);
      confirm({ closeDropdown: false });
      onSearch(null, dataIndex);
    }
  };
}

/**
 * Hàm dùng chung để tạo filterDropdown
 */
function createFilterDropdown(
  FilterComponent: React.ElementType,
  extraProps: Record<string, any>,
  handlers: ReturnType<typeof createHandlers>
) {
  return ({ setSelectedKeys, selectedKeys, confirm, close }: any) => {
    const value = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys;
    const stringValue = typeof value === "string" ? value : JSON.stringify(value ?? "");

    return (
      <Card
        styles={{
          body: {
            padding: 8,
            minWidth: 300
          }
        }}
      >
        <Flex vertical gap={8}>
          <FilterComponent selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} {...extraProps} />
          <ActionFilter
            handleSearch={() => handlers.onSearch(confirm, stringValue)}
            handleReset={() => handlers.onReset(confirm, setSelectedKeys)}
            close={close}
          />
        </Flex>
      </Card>
    );
  };
}

/* -----------------------------------------------------------
1. INPUT FILTER
----------------------------------------------------------- */
interface GetColumnInputSearchParams<T> extends GetCommonFilterParams<T> {
  operator?: TextOperator;
  topSearch?: boolean;
}

export function getColumnInputSearchProps<T extends Record<string, any>>(
  params: GetColumnInputSearchParams<T>
): ColumnType<T> & { searchConfig?: TopSearchConfig } {
  const { dataIndex, placeholder, onSearch, operator = "contain", showSearch = "column" } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  const isColumn = showSearch === "column" || showSearch === "both";
  const isTop = showSearch === "top" || showSearch === "both";

  return {
    ...(isColumn && {
      filterDropdown: createFilterDropdown(InputFilter, { placeholder }, handlers),
      filterIcon: () => <SearchOutlined />
    }),
    ...(isTop && {
      searchConfig: {
        dataIndex: key,
        type: "input",
        placeholder,
        operator
      }
    })
  };
}

/* -----------------------------------------------------------
2. SELECT FILTER (Static Options)
----------------------------------------------------------- */
interface GetColumnSelectPropsParams<T> extends GetCommonFilterParams<T> {
  options: Array<{ label: string; value: string | number }>;
  operator?: SelectOperator;
  topSearch?: boolean;
}

export function getColumnSelectProps<T extends Record<string, any>>(
  params: GetColumnSelectPropsParams<T>
): ColumnType<T> & { searchConfig?: TopSearchConfig } {
  const { dataIndex, placeholder, options, onSearch, operator = "equal", showSearch = "column" } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  const isColumn = showSearch === "column" || showSearch === "both";
  const isTop = showSearch === "top" || showSearch === "both";

  return {
    ...(isColumn && {
      filterDropdown: createFilterDropdown(SelectFilter, { placeholder, options }, handlers),
      filterIcon: () => <SearchOutlined />
    }),
    ...(isTop && {
      searchConfig: {
        dataIndex: key,
        type: "select",
        placeholder,
        options,
        operator
      }
    })
  };
}

/* -----------------------------------------------------------
3. ASYNC SELECT FILTER
----------------------------------------------------------- */
interface GetColumnAsyncSelectPropsParams<T> extends GetCommonFilterParams<T> {
  fetchData: (keyword: string) => Promise<Array<{ label: string; value: any }>>;
  operator?: SelectOperator;
}

export function getColumnAsyncSelectProps<T extends Record<string, any>>(
  params: GetColumnAsyncSelectPropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, fetchData, onSearch, operator = "equal" } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  return {
    filterDropdown: createFilterDropdown(AsyncSelectFilter, { placeholder, fetchData }, handlers),
    filterIcon: () => <SearchOutlined />
  };
}

/* -----------------------------------------------------------
4. NUMBER RANGE FILTER
----------------------------------------------------------- */
interface GetColumnNumberRangePropsParams<T> extends GetCommonFilterParams<T> {
  minPlaceholder?: string;
  maxPlaceholder?: string;
  operator?: NumberOperator;
}

export function getColumnNumberRangeProps<T extends Record<string, any>>(
  params: GetColumnNumberRangePropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, minPlaceholder, maxPlaceholder, onSearch, operator = "between" } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  return {
    filterDropdown: createFilterDropdown(NumberRangeFilter, { placeholder, minPlaceholder, maxPlaceholder }, handlers),
    filterIcon: () => <SearchOutlined />
  };
}

export function getColumnNumberRangeAdvancedProps<T extends Record<string, any>>(
  params: GetColumnNumberRangePropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, minPlaceholder, maxPlaceholder, onSearch } = params;
  const key = String(dataIndex);
  // Advanced filter will handle operator internally through condition select
  const handlers = createHandlers(key, onSearch, "between");

  return {
    filterDropdown: createFilterDropdown(
      NumberRangeFilterAdvanced,
      { placeholder, minPlaceholder, maxPlaceholder },
      handlers
    ),
    filterIcon: () => <SearchOutlined />
  };
}

/* -----------------------------------------------------------
5. DATETIME RANGE FILTER
----------------------------------------------------------- */
interface GetColumnDateTimePropsParams<T> extends GetCommonFilterParams<T> {
  mode?: "single" | "range"; // nếu bạn thích hỗ trợ chọn 1 hoặc 2 mốc
  operator?: DateOperator;
  topSearch?: boolean;
}

export function getColumnDateTimeProps<T extends Record<string, any>>(
  params: GetColumnDateTimePropsParams<T>
): ColumnType<T> & { searchConfig?: TopSearchConfig } {
  const { dataIndex, placeholder, mode = "range", onSearch, operator = "equal", showSearch = "column" } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  const isColumn = showSearch === "column" || showSearch === "both";
  const isTop = showSearch === "top" || showSearch === "both";

  return {
    ...(isColumn && {
      filterDropdown: createFilterDropdown(DateTimeFilter, { placeholder, mode }, handlers),
      filterIcon: () => <SearchOutlined />
    }),
    ...(isTop && {
      searchConfig: {
        dataIndex: key,
        type: mode === "single" ? "date" : "dateRange",
        placeholder,
        operator
      }
    })
  };
}

/**
 * Helper để lấy tất cả top search configs từ danh sách columns
 */
export function getTopSearchConfigs(columns: any[]): TopSearchConfig[] {
  return columns.map((col) => col.searchConfig).filter((config): config is TopSearchConfig => !!config);
}

export function getColumnDateTimeAdvancedProps<T extends Record<string, any>>(
  params: GetColumnDateTimePropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, mode = "range", onSearch } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, "between");

  return {
    filterDropdown: createFilterDropdown(DateTimeFilterAdvanced, { placeholder, mode }, handlers),
    filterIcon: () => <SearchOutlined />
  };
}
