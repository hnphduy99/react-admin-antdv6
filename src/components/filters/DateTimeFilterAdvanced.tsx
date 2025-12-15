import { DatePicker, Flex, Select } from "antd";
import dayjs, { Dayjs } from "dayjs";
interface DateTimeFilterAdvancedProps {
  selectedKeys: any[];
  setSelectedKeys: (keys: any[]) => void;
  placeholder?: string;
}

const dateConditions = [
  { label: "Nhỏ hơn ngày", value: "<" },
  { label: "Lớn hơn ngày", value: ">" },
  { label: "Nhỏ hơn hoặc bằng ngày", value: "<=" },
  { label: "Lớn hơn hoặc bằng ngày", value: ">=" },
  { label: "Từ ngày đến ngày", value: "between" }
];

export function DateTimeFilterAdvanced({ selectedKeys, setSelectedKeys, placeholder }: DateTimeFilterAdvancedProps) {
  const parseValue = () => {
    const data = selectedKeys?.[0];
    return {
      condition: data?.condition ?? "between",
      value: data?.value ? dayjs(data.value) : null,
      value2: data?.value2 ? dayjs(data.value2) : null
    };
  };

  const { condition, value, value2 } = parseValue();

  // Convert date → YYYY-MM-DD
  const formatDate = (d: Dayjs | null) => (d ? d.format("YYYY-MM-DD") : null);

  const updateKeys = (newData: any) => {
    setSelectedKeys([
      {
        condition: newData.condition ?? condition,
        value: formatDate(newData.value ?? value),
        value2: formatDate(newData.value2 ?? value2)
      }
    ]);
  };

  return (
    <Flex vertical gap={8}>
      <Select
        value={condition}
        onChange={(c) => updateKeys({ condition: c })}
        options={dateConditions}
        className="w-full"
      />

      {condition === "between" ? (
        <DatePicker.RangePicker
          value={[value, value2]}
          placeholder={["Từ ngày", "Đến ngày"]}
          onChange={(dates) =>
            updateKeys({
              value: dates?.[0] ?? null,
              value2: dates?.[1] ?? null
            })
          }
        />
      ) : (
        <DatePicker
          value={value}
          onChange={(v) => updateKeys({ value: v })}
          placeholder={placeholder}
          className="w-full"
        />
      )}
    </Flex>
  );
}
