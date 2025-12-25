import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

interface DateTimeFilterProps {
  selectedKeys: any[];
  setSelectedKeys: (keys: any[]) => void;
  placeholder?: string;
  mode?: "single" | "range";
}

const { RangePicker } = DatePicker;

export function DateTimeFilter({ selectedKeys, setSelectedKeys, placeholder, mode = "range" }: DateTimeFilterProps) {
  const parseValue = () => {
    if (!selectedKeys?.[0]) return mode === "single" ? null : [];

    if (mode === "single") {
      // Single mode: value is a plain YYYY-MM-DD string
      return dayjs(selectedKeys[0]);
    }

    // Range mode: value is JSON stringified array
    try {
      const parsed = JSON.parse(selectedKeys[0]);

      if (Array.isArray(parsed)) {
        return parsed.map((v) => (v ? dayjs(v) : null));
      }
    } catch {
      // Do nothing
    }

    return [];
  };

  const value = parseValue();

  const handleChangeSingle = (date: Dayjs | null) => {
    setSelectedKeys(date ? [date.format("YYYY-MM-DD")] : []);
  };

  const handleChangeRange = (dates: (Dayjs | null)[] | null) => {
    setSelectedKeys([JSON.stringify(dates?.map((d) => (d ? d.format("YYYY-MM-DD") : "")) ?? [])]);
  };

  return mode === "single" ? (
    <DatePicker
      value={value as Dayjs | null}
      onChange={handleChangeSingle}
      placeholder={placeholder}
      format="DD/MM/YYYY"
      className="w-full"
    />
  ) : (
    <RangePicker
      value={value as [Dayjs | null, Dayjs | null] | null}
      onChange={handleChangeRange}
      format="DD/MM/YYYY"
      placeholder={[placeholder ?? "Từ ngày", placeholder ?? "Đến ngày"]}
      className="w-full"
    />
  );
}
