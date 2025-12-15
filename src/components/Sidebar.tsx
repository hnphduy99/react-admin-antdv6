import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  TableOutlined,
  FormOutlined,
  UserOutlined,
  SettingOutlined,
  LockOutlined
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { canAccessRoute } from "@/utils/permissions";
import { toggleSidebar } from "@/store/slices/sidebarSlice";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface MenuItemData {
  key: string;
  icon: React.ReactNode;
  label: string;
  children?: MenuItemData[];
  path: string;
}

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.sidebar.collapsed);
  const theme = useAppSelector((state) => state.theme.mode);
  const userRole = useAppSelector((state) => state.auth.user?.role || "user");

  // Define all menu items with their paths
  const allMenuItems: MenuItemData[] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: t("menu.dashboard"),
      path: "/dashboard"
    },
    {
      key: "/table",
      icon: <TableOutlined />,
      label: t("menu.tableExample"),
      path: "/table"
    },
    {
      key: "/form",
      icon: <FormOutlined />,
      label: t("menu.formExample"),
      path: "/form"
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: t("menu.users"),
      path: "/users",
      children: [
        {
          key: "/users/list",
          label: t("menu.userList"),
          path: "/users/list",
          icon: null
        },
        {
          key: "/users/profile",
          label: t("menu.userProfile"),
          path: "/users/profile",
          icon: null
        }
      ]
    },
    {
      key: "password",
      icon: <LockOutlined />,
      label: t("menu.changePassword"),
      path: "/password",
      children: [
        {
          key: "/change-password",
          label: t("menu.changePassword"),
          path: "/change-password",
          icon: null
        },
        {
          key: "/reset-password",
          label: t("menu.resetPassword"),
          path: "/reset-password",
          icon: null
        }
      ]
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: t("menu.settings"),
      path: "/settings"
    }
  ];

  // Filter menu items based on user role permissions
  const filterMenuByPermission = (items: MenuItemData[]): MenuItem[] => {
    return items
      .filter((item) => {
        // If item has children, check if any child is accessible
        if (item.children) {
          const accessibleChildren = item.children.filter((child) => canAccessRoute(userRole, child.path));
          return accessibleChildren.length > 0;
        }
        // Check if user can access this route
        return canAccessRoute(userRole, item.path);
      })
      .map((item) => {
        // Build menu item with conditional children property
        const baseItem = {
          key: item.key,
          icon: item.icon,
          label: item.label
        };

        // If item has children, filter and add them
        if (item.children) {
          const filteredChildren = item.children
            .filter((child) => canAccessRoute(userRole, child.path))
            .map((child) => ({
              key: child.key,
              label: child.label
            }));

          return {
            ...baseItem,
            children: filteredChildren
          } as MenuItem;
        }

        return baseItem as MenuItem;
      });
  };

  const menuItems = filterMenuByPermission(allMenuItems);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => dispatch(toggleSidebar())}
      className="shadow-lg overflow-auto sticky! top-0 bottom-0 h-screen"
      breakpoint="lg"
      width={240}
    >
      <div
        className={`h-[70px] flex items-center sticky top-0 bg-white z-10 justify-center border-b ${collapsed ? "px-2" : "px-4"}`}
      >
        <img src="/vite.svg" alt="logo" className="w-12 h-12" />
        {!collapsed && <div className="text-xl font-bold text-primary-500">{t("common.admin")}</div>}
      </div>
      <Menu
        theme={theme}
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-r-0 overflow-scroll"
      />
    </Sider>
  );
};
