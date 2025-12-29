import {
  ActionFilter,
  AsyncSelectFilter,
  DateTimeFilter,
  DateTimeFilterAdvanced,
  InputFilter,
  NumberRangeFilter,
  NumberRangeFilterAdvanced,
  SelectFilter
} from "@/components/filters";
import type { ColumnSearchValue, SearchDisplayMode, TopSearchConfig } from "@/interfaces/searchTable.interface";
import type {
  DateOperator,
  NumberOperator,
  SearchOperator,
  SelectOperator,
  TextOperator
} from "@/types/searchOperator";
import { SearchOutlined } from "@ant-design/icons";
import { Card, Flex } from "antd";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

interface GetCommonFilterParams<T> {
  dataIndex: keyof T | string;
  placeholder?: string;
  onSearch: (value: ColumnSearchValue | null, dataIndex: string) => void;
  operator?: SearchOperator;
  showSearch?: SearchDisplayMode;
}

/**
 * Tạo các handler cho filter
 * @param dataIndex Cột cần filter
 * @param onSearch Hàm callback khi filter thay đổi
 * @param defaultOperator Operator mặc định
 */
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
 * @param FilterComponent Component filter
 * @param extraProps Props của component filter
 * @param handlers Handlers của filter
 */
function createFilterDropdown(
  FilterComponent: React.ElementType,
  extraProps: Record<string, any>,
  handlers: ReturnType<typeof createHandlers>
) {
  return ({ setSelectedKeys, selectedKeys, confirm, close }: any) => {
    const data = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys;

    const handleSearch = () => {
      let value = data;
      let operator = extraProps.operator;

      // Nếu dữ liệu là object (như trong Advanced Filter), tách value và operator/condition
      if (data && typeof data === "object" && !Array.isArray(data)) {
        value = data.value;
        operator = data.operator || data.condition || operator;
      }

      const stringValue = typeof value === "string" ? value : JSON.stringify(value ?? "");
      handlers.onSearch(confirm, stringValue, operator);
    };

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
            handleSearch={handleSearch}
            handleReset={() => handlers.onReset(confirm, setSelectedKeys)}
            close={close}
          />
        </Flex>
      </Card>
    );
  };
}

interface GetColumnInputSearchParams<T> extends GetCommonFilterParams<T> {
  operator?: TextOperator;
  topSearch?: boolean;
}

/**
 * Tạo các props cho column input search
 * @param params Tham số
 * @returns
 */
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

interface GetColumnSelectPropsParams<T> extends GetCommonFilterParams<T> {
  options: Array<{ label: string; value: string | number }>;
  operator?: SelectOperator;
  topSearch?: boolean;
}

/**
 * Tạo các props cho column select
 * @param params Tham số
 * @returns
 */
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

interface GetColumnAsyncSelectPropsParams<T> extends GetCommonFilterParams<T> {
  fetchData: (keyword: string) => Promise<Array<{ label: string; value: any }>>;
  operator?: SelectOperator;
}

/**
 * Tạo các props cho column async select
 * @param params Tham số
 * @returns
 */
export function getColumnAsyncSelectProps<T extends Record<string, any>>(
  params: GetColumnAsyncSelectPropsParams<T>
): ColumnType<T> {
  const { dataIndex, placeholder, fetchData, onSearch, operator = "equal", showSearch = "column" } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  const isColumn = showSearch === "column" || showSearch === "both";
  const isTop = showSearch === "top" || showSearch === "both";

  return {
    ...(isColumn && {
      filterDropdown: createFilterDropdown(AsyncSelectFilter, { placeholder, fetchOptions: fetchData }, handlers),
      filterIcon: () => <SearchOutlined />
    }),
    ...(isTop && {
      searchConfig: {
        dataIndex: key,
        type: "asyncSelect",
        placeholder,
        fetchData,
        operator
      }
    })
  };
}

interface GetColumnNumberRangePropsParams<T> extends GetCommonFilterParams<T> {
  minPlaceholder?: string;
  maxPlaceholder?: string;
  operator?: NumberOperator;
}

/**
 * Tạo các props cho column number range
 * @param params Tham số
 * @returns
 */
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

/**
 * Tạo các props cho column number range advanced
 * @param params Tham số
 * @returns
 */
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

interface GetColumnDateTimePropsParams<T> extends GetCommonFilterParams<T> {
  mode?: "single" | "range";
  operator?: DateOperator;
  topSearch?: boolean;
}

/**
 * Tạo các props cho column date time
 * @param params Tham số
 * @returns
 */
export function getColumnDateTimeProps<T extends Record<string, any>>(
  params: GetColumnDateTimePropsParams<T>
): ColumnType<T> & { searchConfig?: TopSearchConfig } {
  const { dataIndex, placeholder, mode = "range", onSearch, operator = "between", showSearch = "column" } = params;
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
 * Tạo các props cho column date time advanced
 * @param params Tham số
 * @returns
 */
export function getColumnDateTimeAdvancedProps<T extends Record<string, any>>(
  params: GetColumnDateTimePropsParams<T>
): ColumnType<T> & { searchConfig?: TopSearchConfig } {
  const { dataIndex, placeholder, mode = "range", onSearch, operator = "between", showSearch = "column" } = params;
  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  const isColumn = showSearch === "column" || showSearch === "both";
  const isTop = showSearch === "top" || showSearch === "both";

  return {
    ...(isColumn && {
      filterDropdown: createFilterDropdown(DateTimeFilterAdvanced, { placeholder, mode, operator }, handlers),
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
 * @param columns Danh sách columns
 * @returns Mảng các top search configs
 */
export function getTopSearchConfigs(columns: any[]): TopSearchConfig[] {
  return columns.map((col) => col.searchConfig).filter((config): config is TopSearchConfig => !!config);
}
