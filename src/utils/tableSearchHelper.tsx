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

interface GetCommonFilterParams<T> {
  dataIndex: keyof T | string;
  placeholder?: string;
  onSearch: (value: string, dataIndex: string) => void;
}

function createHandlers(dataIndex: string, onSearch: (v: string, d: string) => void) {
  return {
    onSearch: (confirm: (p?: FilterConfirmProps) => void, value: string) => {
      confirm();
      onSearch(value, dataIndex);
    },

    onReset: (confirm: (p?: FilterConfirmProps) => void, setSelectedKeys: (k: React.Key[]) => void) => {
      setSelectedKeys([]);
      confirm({ closeDropdown: false });
      onSearch("", dataIndex);
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
export function getColumnInputSearchProps<T extends Record<string, any>>(
  params: GetCommonFilterParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, onSearch } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch);

  return {
    filterDropdown: createFilterDropdown(InputFilter, { placeholder }, handlers),
    filterIcon: () => <SearchOutlined />
  };
}

/* -----------------------------------------------------------
2. SELECT FILTER (Static Options)
----------------------------------------------------------- */
interface GetColumnSelectPropsParams<T> extends GetCommonFilterParams<T> {
  options: Array<{ label: string; value: string | number }>;
}

export function getColumnSelectProps<T extends Record<string, any>>(
  params: GetColumnSelectPropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, options, onSearch } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch);

  return {
    filterDropdown: createFilterDropdown(SelectFilter, { placeholder, options }, handlers),
    filterIcon: () => <SearchOutlined />
  };
}

/* -----------------------------------------------------------
3. ASYNC SELECT FILTER
----------------------------------------------------------- */
interface GetColumnAsyncSelectPropsParams<T> extends GetCommonFilterParams<T> {
  fetchData: (keyword: string) => Promise<Array<{ label: string; value: any }>>;
}

export function getColumnAsyncSelectProps<T extends Record<string, any>>(
  params: GetColumnAsyncSelectPropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, fetchData, onSearch } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch);

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
}

export function getColumnNumberRangeProps<T extends Record<string, any>>(
  params: GetColumnNumberRangePropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, minPlaceholder, maxPlaceholder, onSearch } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch);

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
  const handlers = createHandlers(key, onSearch);

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
}

export function getColumnDateTimeProps<T extends Record<string, any>>(
  params: GetColumnDateTimePropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, mode = "range", onSearch } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch);

  return {
    filterDropdown: createFilterDropdown(DateTimeFilter, { placeholder, mode }, handlers),
    filterIcon: () => <SearchOutlined />
  };
}

export function getColumnDateTimeAdvancedProps<T extends Record<string, any>>(
  params: GetColumnDateTimePropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, mode = "range", onSearch } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch);

  return {
    filterDropdown: createFilterDropdown(DateTimeFilterAdvanced, { placeholder, mode }, handlers),
    filterIcon: () => <SearchOutlined />
  };
}
