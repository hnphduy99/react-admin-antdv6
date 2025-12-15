import { InputNumber } from "antd";

interface NumberRangeFilterProps {
  selectedKeys: any[];
  setSelectedKeys: (keys: any[]) => void;
  placeholder?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export function NumberRangeFilter({
  selectedKeys,
  setSelectedKeys,
  minPlaceholder = "Min",
  maxPlaceholder = "Max"
}: NumberRangeFilterProps) {
  // Parse JSON → [min, max]
  const parseValue = () => {
    if (!selectedKeys?.[0]) return [null, null];

    try {
      const parsed = JSON.parse(selectedKeys[0]);
      if (Array.isArray(parsed)) {
        return [parsed[0] !== "" ? Number(parsed[0]) : null, parsed[1] !== "" ? Number(parsed[1]) : null];
      }
    } catch {
      // Do nothing
    }

    return [null, null];
  };

  const [min, max] = parseValue();

  const updateRange = (newMin: number | null, newMax: number | null) => {
    setSelectedKeys([JSON.stringify([newMin ?? "", newMax ?? ""])]);
  };

  return (
    <>
      <InputNumber
        placeholder={minPlaceholder}
        value={min}
        onChange={(value) => updateRange(value, max)}
        className="w-full!"
      />
      <InputNumber
        placeholder={maxPlaceholder}
        value={max}
        onChange={(value) => updateRange(min, value)}
        className="w-full!"
      />
    </>
  );
}
