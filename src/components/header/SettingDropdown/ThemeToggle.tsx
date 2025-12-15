import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { toggleTheme } from "@/store/slices/themeSlice";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Switch } from "antd";

export const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);

  return (
    <Switch
      checked={themeMode === "dark"}
      onChange={() => dispatch(toggleTheme())}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
};
