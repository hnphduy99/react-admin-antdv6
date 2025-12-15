import { Dropdown, Avatar, Button } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { logout } from "@/store/slices/authSlice";
import { useTranslation } from "react-i18next";

export const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: t("user.profile"),
      onClick: () => navigate("users/profile")
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: t("user.settings"),
      onClick: () => navigate("/settings")
    },
    {
      type: "divider"
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("user.logout"),
      onClick: handleLogout,
      danger: true
    }
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Button type="text" size="large" className="flex items-center gap-2 h-auto px-2">
        <Avatar size="large" icon={<UserOutlined />} src={user?.avatar} />
        <span className="hidden md:inline text-sm font-medium">{user?.name || "Admin User"}</span>
      </Button>
    </Dropdown>
  );
};
