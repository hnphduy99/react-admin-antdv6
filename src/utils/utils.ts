import type { InputNumberProps } from "antd";

export const formatter: InputNumberProps<number>["formatter"] = (value) => {
  const [start, end] = `${value}`.split(".") || [];
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$ ${end ? `${v}.${end}` : `${v}`}`;
};

export const parser: InputNumberProps<number>["parser"] = (value: string | undefined) => {
  return value?.replace(/\$\s?|(,*)/g, "") as unknown as number;
};
