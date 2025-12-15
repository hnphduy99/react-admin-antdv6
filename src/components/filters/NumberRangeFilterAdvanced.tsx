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
  const condition = selectedKeys[0]?.condition ?? "<";
  const value = selectedKeys[0]?.value ?? null;
  const value2 = selectedKeys[0]?.value2 ?? null;

  const update = (patch: any) => {
    setSelectedKeys([
      {
        condition,
        value,
        value2,
        ...patch
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
