import { ROUTE } from "@/configs/route-config";
import { SafetyOutlined, UserOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const ProfileNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      key: "personal-info",
      label: t("user.personalInfo"),
      icon: <UserOutlined className="text-orange-500! text-lg" />,
      path: `${ROUTE.PROFILE}${ROUTE.PERSONAL_INFO}`,
      iconBg: "bg-orange-50"
    },
    {
      key: "change-password",
      label: t("password.changePassword"),
      icon: <SafetyOutlined className="text-green-500! text-lg" />,
      path: `${ROUTE.PROFILE}${ROUTE.CHANGE_PASSWORD}`,
      iconBg: "bg-green-50"
    }
  ];

  return (
    <Flex vertical gap={4}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.key}
            className={`flex items-center p-2 cursor-pointer rounded-xl transition-all duration-300 ${
              isActive ? "bg-blue-50/50" : "hover:bg-gray-50"
            }`}
            onClick={() => navigate(item.path)}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${item.iconBg}`}>
              {item.icon}
            </div>
            <span
              className={`text-base font-medium transition-colors duration-300 ${
                isActive ? "text-primary-500" : "text-gray-700"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </Flex>
  );
};

export default ProfileNav;
