import ActionFilter from "@/components/filters/ActionFilter";
import { AsyncSelectFilter } from "@/components/filters/AsyncSelectFilter";
import { DateTimeFilterAdvanced } from "@/components/filters/DateTimeFilterAdvanced";
import { InputFilter } from "@/components/filters/InputFilter";
import { NumberRangeFilterAdvanced } from "@/components/filters/NumberRangeFilterAdvanced";
import { SelectFilter } from "@/components/filters/SelectFilter";
import type {
  ColumnSearchType,
  ColumnSearchValue,
  SearchDisplayMode,
  TopSearchConfig
} from "@/interfaces/searchTable.interface";
import type { SearchOperator } from "@/types/searchOperator";
import SearchOutlined from "@ant-design/icons/lib/icons/SearchOutlined";
import Card from "antd/es/card";
import Flex from "antd/es/flex";
import type { FilterConfirmProps, FilterDropdownProps } from "antd/es/table/interface";

//TODO: cần tìm kiếm dữ liệu trên bảng
interface IBaseFilterParams<T> {
  dataIndex: keyof T | string;
  placeholder?: string | string[];
  operator: SearchOperator;
  showSearch: SearchDisplayMode;
  onSearch: (value: ColumnSearchValue | null, dataIndex: string) => void;
}

type ICommonFilterParams<T> = IBaseFilterParams<T> &
  (
    | {
        typeSearch: "asyncSelect";
        fetchData: () => Promise<Array<{ label: string; value: any }>>;
      }
    | {
        typeSearch: "select";
        options: Array<{ label: string; value: string | number }>;
      }
    | {
        typeSearch: Exclude<ColumnSearchType, "asyncSelect" | "select">;
      }
  );

/**
 * Tạo các handler cho filter
 * @param dataIndex Cột cần filter
 * @param onSearch Hàm callback khi filter thay đổi
 * @param defaultOperator Operator mặc định
 */
const createHandlers = (
  dataIndex: string,
  onSearch: (value: ColumnSearchValue | null, dataIndex: string) => void,
  defaultOperator: SearchOperator = "contain"
) => {
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
};

/**
 * Hàm dùng chung để tạo filterDropdown
 * @param FilterComponent Component filter
 * @param props Props của component filter
 * @param handlers Handlers của filter
 */
const renderFilterDropdown = (
  FilterComponent: React.ElementType,
  props: Record<string, any>,
  handlers: ReturnType<typeof createHandlers>
) => {
  return ({ setSelectedKeys, selectedKeys, confirm, close }: FilterDropdownProps & { selectedKeys: any }) => {
    const data = Array.isArray(selectedKeys) ? selectedKeys[0] : selectedKeys;

    const handleSearch = () => {
      let value = data;
      let operator = props.operator;

      // Nếu dữ liệu là object, tách value và operator/condition
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
};

/**
 * Tạo column search
 * @param params tham số
 * @returns
 */
export function createColumnSearch<T>(params: ICommonFilterParams<T>) {
  const { dataIndex, onSearch, operator, showSearch, typeSearch } = params;

  const key = String(dataIndex);
  const handlers = createHandlers(key, onSearch, operator);

  const isColumn = showSearch !== "top";
  const isTop = showSearch !== "column";

  const getFilterComponent = () => {
    switch (typeSearch) {
      case "input":
        return InputFilter;
      case "select":
        return SelectFilter;
      case "asyncSelect":
        return AsyncSelectFilter;
      case "numberRange":
        return NumberRangeFilterAdvanced;
      case "dateRange":
        return DateTimeFilterAdvanced;
      default:
        return InputFilter;
    }
  };

  return {
    ...(isColumn && {
      filterDropdown: renderFilterDropdown(getFilterComponent(), params, handlers),
      filterIcon: () => <SearchOutlined />
    }),
    ...(isTop && {
      searchConfig: { type: typeSearch, ...params }
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
