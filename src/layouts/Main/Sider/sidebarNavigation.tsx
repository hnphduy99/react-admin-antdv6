import { ROUTE } from "@/configs/route-config";
import {
  BlockOutlined,
  DashboardOutlined,
  LockOutlined,
  ProductOutlined,
  SettingOutlined,
  TableOutlined,
  UserOutlined
} from "@ant-design/icons";

export interface MenuItemData {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItemData[];
  path?: string;
  permissionKey?: string;
}

export const sidebarNavigation: MenuItemData[] = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "menu.dashboard",
    path: "/dashboard",
    permissionKey: "dashboard"
  },
  {
    key: "/example",
    icon: <TableOutlined />,
    label: "menu.example",
    path: "/example",
    children: [
      {
        key: "/form",
        icon: null,
        label: "menu.formExample",
        path: "/form"
      }
    ]
  },

  {
    key: "user-manager",
    icon: <UserOutlined />,
    label: "menu.users",
    children: [
      {
        key: "users",
        permissionKey: "users",
        label: "menu.userList",
        path: ROUTE.USER,
        icon: null
      },
      {
        key: "profile",
        label: "menu.userProfile",
        path: ROUTE.PROFILE,
        icon: null
      }
    ]
  },
  {
    key: "auth",
    icon: <LockOutlined />,
    label: "menu.auth",
    path: "/auth",
    children: [
      {
        key: "register",
        label: "menu.register",
        path: ROUTE.REGISTER,
        icon: null
      },
      {
        key: "login",
        label: "menu.login",
        path: ROUTE.LOGIN,
        icon: null
      },
      {
        key: "change-password",
        label: "menu.changePassword",
        path: ROUTE.CHANGE_PASSWORD,
        icon: null
      },
      {
        key: "reset-password",
        label: "menu.resetPassword",
        path: ROUTE.RESET_PASSWORD,
        icon: null
      },
      {
        key: "create-password",
        label: "menu.createPassword",
        path: ROUTE.CREATE_PASSWORD,
        icon: null
      }
    ]
  },
  {
    key: "products",
    icon: <ProductOutlined />,
    label: "menu.products",
    path: "/products",
    children: [
      {
        key: "products",
        permissionKey: "products",
        label: "menu.productList",
        path: "/products/list",
        icon: null
      }
    ]
  },
  {
    label: "common.ui",
    key: "ui",
    icon: <BlockOutlined />,
    children: [
      {
        key: "/ui/notification",
        label: "menu.notification",
        path: "/ui/notification",
        icon: null
      }
    ]
  },
  /*new-sidebar-nav-here*/
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "menu.settings",
    path: "/settings"
  }
];
