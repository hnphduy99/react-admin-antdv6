import axiosInstance from "@/utils/axios";
import type { SelectProps } from "antd";
import { Select, Spin } from "antd";
import { useState } from "react";

interface SelectWithApiProps extends SelectProps {
  apiEndpoint: string;
  valueKey?: string;
  labelKey?: string;
  mapping?: (item: any) => { label: string; value: string | number };
}

export default function SelectWithApi({
  apiEndpoint,
  valueKey = "value",
  labelKey = "label",
  mapping,
  ...props
}: SelectWithApiProps) {
  const [options, setOptions] = useState<{ label: string; value: string | number }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(apiEndpoint);
      const data = res.data?.data?.collection || res.data?.data || [];

      const formattedOptions = data.map((item: any) => {
        if (mapping) return mapping(item);
        return {
          label: item[labelKey],
          value: item[valueKey]
        };
      });

      setOptions(formattedOptions);
    } catch (error: any) {
      console.error("SelectWithApi Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      {...props}
      loading={loading}
      options={options}
      notFoundContent={loading ? <Spin size="small" /> : null}
      onOpenChange={(open) => {
        if (open) {
          fetchData();
        }
      }}
    />
  );
}
