import { DatePicker, Flex, Select } from "antd";
import dayjs from "dayjs";
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
    const condition = data?.condition ?? "between";
    const v = data?.value;
    let v1 = null;
    let v2 = null;

    if (v && typeof v === "string") {
      // Tự động nhận diện định dạng: Nếu bắt đầu bằng "[" thì là mảng JSON
      if (v.startsWith("[")) {
        try {
          const parsed = JSON.parse(v);
          if (Array.isArray(parsed)) {
            v1 = parsed[0] ? dayjs(parsed[0], "YYYY-MM-DD HH:mm:ss") : null;
            v2 = parsed[1] ? dayjs(parsed[1], "YYYY-MM-DD HH:mm:ss") : null;
          }
        } catch {
          // Fallback nếu JSON lỗi
          v1 = dayjs(v, "YYYY-MM-DD");
        }
      } else {
        // Ngược lại là chuỗi ngày đơn
        v1 = dayjs(v, "YYYY-MM-DD");
      }
    }

    return {
      condition,
      value: v1,
      value2: v2
    };
  };

  const { condition, value, value2 } = parseValue();

  const updateKeys = (newData: any) => {
    const nextCondition = newData.condition ?? condition;
    const v1 = newData.value ?? value;
    const v2 = newData.value2 ?? value2;

    setSelectedKeys([
      {
        condition: nextCondition,
        value:
          nextCondition === "between"
            ? JSON.stringify([v1?.format("YYYY-MM-DD 00:00:00") ?? "", v2?.format("YYYY-MM-DD 23:59:59") ?? ""])
            : v1?.format("YYYY-MM-DD")
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
          format="DD/MM/YYYY"
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
          format="DD/MM/YYYY"
          onChange={(v) => updateKeys({ value: v })}
          placeholder={placeholder}
          className="w-full"
        />
      )}
    </Flex>
  );
}
