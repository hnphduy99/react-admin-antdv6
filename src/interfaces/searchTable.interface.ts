import type { SearchOperator } from "../types/searchOperator";

// Cấu trúc giá trị search với operator
export interface ColumnSearchValue {
  value: string | number;
  operator: SearchOperator;
}

export type ColumnSearchType = "input" | "select" | "asyncSelect" | "number" | "numberRange" | "date" | "dateRange";

export interface TopSearchConfig {
  dataIndex: string;
  type: ColumnSearchType;
  placeholder?: string;
  options?: Array<{ label: string; value: string | number }>;
  operator?: SearchOperator;
  fetchData?: (keyword: string) => Promise<Array<{ label: string; value: any }>>;
}

export type SearchDisplayMode = "top" | "column" | "both";
