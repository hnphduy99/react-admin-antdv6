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
import type { SearchOperator } from "@/types/searchOperator";
import { SearchOutlined } from "@ant-design/icons";
import Card from "antd/es/card";
import Flex from "antd/es/flex";
import type { ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";

interface BaseParams<T> {
  dataIndex: keyof T | string;
  placeholder?: string;
  onSearch: (value: ColumnSearchValue | null, dataIndex: string) => void;
  operator?: SearchOperator;
  showSearch?: SearchDisplayMode;
  filterComponent?: React.ElementType;
  filterProps?: any;
  topConfig?: Omit<TopSearchConfig, "dataIndex">;
  handlers?: ReturnType<typeof createHandlers>;
}

function createHandlers(dataIndex: string, onSearch: BaseParams<any>["onSearch"], defaultOperator: SearchOperator) {
  return {
    onSearch(confirm: (p?: FilterConfirmProps) => void, value: any, operator?: SearchOperator) {
      confirm();
      if (!value || (typeof value === "object" && !value.value)) {
        onSearch(null, dataIndex);
        return;
      }
      onSearch({ value, operator: operator ?? defaultOperator }, dataIndex);
    },
    onReset(confirm: any, setSelectedKeys: any) {
      setSelectedKeys([]);
      confirm({ closeDropdown: false });
      onSearch(null, dataIndex);
    }
  };
}

/**
 * Hàm dùng chung để tạo filterDropdown
 * @param FilterComponent Component filter
 * @param props Props của component filter
 * @param handlers Handlers của filter
 */
function renderFilterDropdown(
  FilterComponent: React.ElementType,
  props: Record<string, any>,
  handlers: ReturnType<typeof createHandlers>
) {
  return ({ setSelectedKeys, selectedKeys, confirm, close }: any) => {
    const data = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys;

    const handleSearch = () => {
      let value = data;
      let operator = props.operator;

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
          <FilterComponent selectedKeys={selectedKeys} setSelectedKeys={setSelectedKeys} {...props} />
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

export function createColumnSearch<T>(params: BaseParams<T>): ColumnType<T> & { searchConfig?: TopSearchConfig } {
  const {
    dataIndex,
    onSearch,
    operator = "contain",
    showSearch = "column",
    filterComponent,
    filterProps,
    topConfig,
    handlers: handlersParam
  } = params;

  const key = String(dataIndex);
  const handlers = handlersParam || createHandlers(key, onSearch, operator);

  const isColumn = showSearch !== "top";
  const isTop = showSearch !== "column";

  return {
    ...(isColumn &&
      filterComponent && {
        filterDropdown: renderFilterDropdown(filterComponent, filterProps, handlers),
        filterIcon: () => <SearchOutlined />
      }),
    ...(isTop &&
      topConfig && {
        searchConfig: { dataIndex: key, operator, ...topConfig }
      })
  };
}

export const getColumnInputSearch = <T extends Record<string, any>>(params: BaseParams<T>) => {
  return createColumnSearch({
    ...params,
    filterComponent: InputFilter,
    filterProps: { placeholder: params.placeholder },
    topConfig: { type: "input", ...params }
  });
};

export const getColumnSelectSearch = <T extends Record<string, any>>(
  params: BaseParams<T> & { options: Array<{ label: string; value: string | number }> }
) => {
  return createColumnSearch({
    ...params,
    filterComponent: SelectFilter,
    filterProps: { placeholder: params.placeholder },
    topConfig: { type: "select", ...params }
  });
};

export const getColumnAsyncSelectSearch = <T extends Record<string, any>>(
  params: BaseParams<T> & { fetchData: (keyword: string) => Promise<Array<{ label: string; value: any }>> }
) => {
  return createColumnSearch({
    ...params,
    filterComponent: AsyncSelectFilter,
    filterProps: { fetchOptions: params.fetchData, placeholder: params.placeholder },
    topConfig: { type: "asyncSelect", ...params }
  });
};

/**
 * Helper nội bộ để tạo tìm kiếm theo khoảng (Date hoặc Number)
 */
const createRangeColumnSearch = <T extends Record<string, any>>(
  params: BaseParams<T> & {
    mode?: "single" | "range";
    filterComponent: React.ElementType;
    type?: TopSearchConfig["type"];
  }
) => {
  const { mode = "range", filterComponent, type, ...rest } = params;
  const isRange = mode === "range";
  const defaultOperator = isRange ? "between" : "equal";

  return createColumnSearch({
    operator: params.operator || defaultOperator,
    ...rest,
    filterComponent,
    filterProps: { mode, placeholder: params.placeholder },
    topConfig: {
      type: type || (isRange ? "dateRange" : "date"),
      ...params
    }
  });
};

export const getColumnDateTimeSearch = <T extends Record<string, any>>(
  params: BaseParams<T> & { mode?: "single" | "range" }
) => {
  return createRangeColumnSearch({
    ...params,
    filterComponent: DateTimeFilter
  });
};

export const getColumnDateTimeAdvancedSearch = <T extends Record<string, any>>(
  params: BaseParams<T> & { mode?: "single" | "range" }
) => {
  return createRangeColumnSearch({
    ...params,
    filterComponent: DateTimeFilterAdvanced
  });
};

export const getColumnNumberRangeSearch = <T extends Record<string, any>>(params: BaseParams<T>) => {
  return createRangeColumnSearch({
    ...params,
    filterComponent: NumberRangeFilter,
    type: "numberRange"
  });
};

export const getColumnNumberRangeAdvancedSearch = <T extends Record<string, any>>(params: BaseParams<T>) => {
  return createRangeColumnSearch({
    ...params,
    filterComponent: NumberRangeFilterAdvanced,
    type: "numberRange"
  });
};

/**
 * Helper để lấy tất cả top search configs từ danh sách columns
 * @param columns Danh sách columns
 * @returns Mảng các top search configs
 */
export function getTopSearchConfigs(columns: any[]): TopSearchConfig[] {
  return columns.map((col) => col.searchConfig).filter((config): config is TopSearchConfig => !!config);
}
