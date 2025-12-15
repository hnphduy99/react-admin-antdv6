import { useAppSelector } from "@/hooks/useRedux";
import { Menu, type MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { sidebarNavigation } from "../sidebarNavigation";
import { useNavigate } from "react-router-dom";
import { SiderMenuStyles } from "./SiderMenu.styles";

const SiderMenu = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.mode);
  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Menu
      theme={theme}
      mode="inline"
      styles={SiderMenuStyles}
      selectedKeys={[location.pathname]}
      items={sidebarNavigation.map((item) => ({
        key: item.key,
        icon: item.icon,
        label: t(item.label),
        path: item.path,
        children: item.children?.map((child) => ({
          key: child.key,
          icon: child.icon,
          label: t(child.label),
          path: child.path
        }))
      }))}
      onClick={handleMenuClick}
      className="sider-menu border-r-0 overflow-y-scroll font-semibold"
    />
  );
};

export default SiderMenu;
