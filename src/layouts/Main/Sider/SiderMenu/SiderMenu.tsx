import { useAppSelector } from "@/hooks/useRedux";
import { hasActionPermission } from "@/utils/permissions";
import { Menu, type MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { sidebarNavigation, type MenuItemData } from "../sidebarNavigation";
import { SiderMenuStyles } from "./SiderMenu.styles";

const SiderMenu = () => {
  const { t } = useTranslation();
  const theme = useAppSelector((state) => state.theme.mode);
  const navigate = useNavigate();
  const location = useLocation();

  const isAccessible = (item: MenuItemData): boolean => {
    // Nếu không có phan_quyen hoặc key không tồn tại trong phan_quyen,
    // ta mặc định cho phép hiện menu đó.
    return hasActionPermission(item.permissionKey || item.key, "showMenu", true);
  };

  const filteredMenuItems = sidebarNavigation
    .filter((item) => {
      // Nếu item có children, kiểm tra xem có bất kỳ child nào được phép hiển thị không
      if (item.children) {
        const accessibleChildren = item.children.filter((child) => isAccessible(child));
        return accessibleChildren.length > 0;
      }
      // Nếu không có children, kiểm tra trực tiếp item đó
      return isAccessible(item);
    })
    .map((item) => {
      const baseItem = {
        key: item.path || item.key, // Ưu tiên path để navigate
        icon: item.icon,
        label: t(item.label)
      };

      if (item.children) {
        const children = item.children
          .filter((child) => isAccessible(child))
          .map((child) => ({
            key: child.path || child.key,
            icon: child.icon,
            label: t(child.label)
          }));
        return { ...baseItem, children };
      }

      return baseItem;
    });

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Menu
      theme={theme}
      mode="inline"
      styles={SiderMenuStyles}
      selectedKeys={[location.pathname]}
      items={filteredMenuItems}
      onClick={handleMenuClick}
      className="sider-menu border-r-0 overflow-y-scroll font-semibold"
    />
  );
};

export default SiderMenu;
