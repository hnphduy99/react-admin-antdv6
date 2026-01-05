import { Flex, InputNumber, Select, Space } from "antd";
interface NumberRangeFilterAdvancedProps {
  selectedKeys: any[];
  setSelectedKeys: (keys: any[]) => void;
  placeholder?: string;
}

const numberConditions = [
  { label: "Nhỏ hơn", value: "<" },
  { label: "Lớn hơn", value: ">" },
  { label: "Nhỏ hơn hoặc bằng", value: "<=" },
  { label: "Lớn hơn hoặc bằng", value: ">=" },
  { label: "Từ ... đến ...", value: "between" }
];

export function NumberRangeFilterAdvanced({
  selectedKeys,
  setSelectedKeys,
  placeholder
}: NumberRangeFilterAdvancedProps) {
  const parseValue = () => {
    const data = selectedKeys?.[0];
    const condition = data?.condition ?? "<";
    const v = data?.value;
    let v1 = v;
    let v2 = null;

    if (typeof v === "string" && v.startsWith("[")) {
      try {
        const parsed = JSON.parse(v);
        if (Array.isArray(parsed)) {
          v1 = parsed[0] !== "" ? Number(parsed[0]) : null;
          v2 = parsed[1] !== "" ? Number(parsed[1]) : null;
        }
      } catch {
        // ignore
      }
    }

    return { condition, value: v1, value2: v2 };
  };

  const { condition, value, value2 } = parseValue();

  const update = (patch: any) => {
    const nextCondition = patch.condition ?? condition;
    const v1 = "value" in patch ? patch.value : value;
    const v2 = "value2" in patch ? patch.value2 : value2;

    setSelectedKeys([
      {
        condition: nextCondition,
        value: nextCondition === "between" ? JSON.stringify([v1 ?? "", v2 ?? ""]) : v1
      }
    ]);
  };

  return (
    <Flex vertical gap={8}>
      <Select value={condition} onChange={(c) => update({ condition: c })} options={numberConditions} />
      {condition === "between" ? (
        <Space>
          <InputNumber className="w-full!" placeholder="Từ" value={value} onChange={(v) => update({ value: v })} />
          <InputNumber className="w-full!" placeholder="Đến" value={value2} onChange={(v) => update({ value2: v })} />
        </Space>
      ) : (
        <InputNumber
          placeholder={placeholder ?? "Nhập giá trị"}
          value={value}
          onChange={(v) => update({ value: v })}
          className="w-full!"
        />
      )}
    </Flex>
  );
}
