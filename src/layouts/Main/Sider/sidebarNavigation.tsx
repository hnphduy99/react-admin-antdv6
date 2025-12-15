import {
  BlockOutlined,
  DashboardOutlined,
  LockOutlined,
  ProductOutlined,
  SettingOutlined,
  TableOutlined,
  UserOutlined
} from "@ant-design/icons";

interface MenuItemData {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItemData[];
  path?: string;
}

export const sidebarNavigation: MenuItemData[] = [
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "menu.dashboard",
    path: "/dashboard"
  },
  {
    key: "/example",
    icon: <TableOutlined />,
    label: "menu.example",
    path: "/example",
    children: [
      {
        key: "/table",
        icon: null,
        label: "menu.tableExample",
        path: "/table"
      },
      {
        key: "/form",
        icon: null,
        label: "menu.formExample",
        path: "/form"
      }
    ]
  },

  {
    key: "users",
    icon: <UserOutlined />,
    label: "menu.users",
    path: "/users",
    children: [
      {
        key: "/users/list",
        label: "menu.userList",
        path: "/users/list",
        icon: null
      },
      {
        key: "/users/profile",
        label: "menu.userProfile",
        path: "/users/profile",
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
        key: "/register",
        label: "menu.register",
        path: "/register",
        icon: null
      },
      {
        key: "/login",
        label: "menu.login",
        path: "/login",
        icon: null
      },
      {
        key: "/change-password",
        label: "menu.changePassword",
        path: "/change-password",
        icon: null
      },
      {
        key: "/reset-password",
        label: "menu.resetPassword",
        path: "/reset-password",
        icon: null
      },
      {
        key: "/create-password",
        label: "menu.createPassword",
        path: "/create-password",
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
        key: "/products/list",
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
  {
    key: "/settings",
    icon: <SettingOutlined />,
    label: "menu.settings",
    path: "/settings"
  }
];
