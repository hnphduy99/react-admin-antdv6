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
  // Convert value từ selectedKeys thành dayjs
  const parseValue = () => {
    if (!selectedKeys?.[0]) return mode === "single" ? null : [];

    try {
      const parsed = JSON.parse(selectedKeys[0]);

      if (mode === "single") return dayjs(parsed);

      if (Array.isArray(parsed)) {
        return parsed.map((v) => (v ? dayjs(v) : null));
      }
    } catch {
      // Do nothing
    }

    return mode === "single" ? null : [];
  };

  const value = parseValue();

  const handleChangeSingle = (date: Dayjs | null) => {
    setSelectedKeys([JSON.stringify(date ? date.toISOString() : "")]);
  };

  const handleChangeRange = (dates: (Dayjs | null)[] | null) => {
    setSelectedKeys([JSON.stringify(dates?.map((d) => (d ? d.toISOString() : "")) ?? [])]);
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
