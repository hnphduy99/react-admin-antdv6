// Định nghĩa các loại operator
export type TextOperator = "contain" | "equal" | "start_with" | "end_with";

export type NumberOperator =
  | "equal"
  | "not_equal"
  | "less_than"
  | "greater_than"
  | "less_than_or_equal"
  | "greater_than_or_equal"
  | "between";

export type DateOperator =
  | "equal"
  | "less_than"
  | "greater_than"
  | "less_than_or_equal"
  | "greater_than_or_equal"
  | "between";

export type SelectOperator = "equal" | "not_equal" | "includes";

export type SearchOperator = TextOperator | NumberOperator | DateOperator | SelectOperator;
