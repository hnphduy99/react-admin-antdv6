import { useState, useEffect } from "react";
import type { Notification } from "@/types";
import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Dropdown, Typography, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { mockApi } from "@/services/mock";

const { Text } = Typography;

export const NotificationDropdown = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch notifications when dropdown opens
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await mockApi.notification.getNotifications();

      if (response.success) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notificationContent = (
    <Card className="w-80 shadow-lg" styles={{ body: { padding: "8px 0px" } }}>
      <div className="p-4 border-b border-gray-200 bg-white">
        <Text strong>{t("notification.notifications").toUpperCase()}</Text>
      </div>
      <div className="max-h-96 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 text-gray-500">{t("notification.noNotifications")}</div>
        ) : (
          <>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`py-2 px-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? "bg-blue-50" : "bg-white"}`}
              >
                <div className="flex items-center gap-2">
                  <Text strong className="text-sm">
                    {notification.title}
                  </Text>
                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
                <div>
                  <Text className="text-xs overflow-hidden text-ellipsis line-clamp-2">{notification.description}</Text>
                  <br />
                  <Text type="secondary" className="text-xs">
                    {notification.createdAt}
                  </Text>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="p-2 text-center border-t border-gray-200 bg-white">
        <Button type="link" size="small">
          {t("notification.viewAll")}
        </Button>
      </div>
    </Card>
  );

  return (
    <Dropdown
      placement="bottom"
      arrow
      popupRender={() => notificationContent}
      trigger={["click"]}
      open={open}
      onOpenChange={setOpen}
    >
      <Badge count={unreadCount} offset={[-5, 5]}>
        <Button size="large" type="text" icon={<BellOutlined />} className="flex items-center justify-center" />
      </Badge>
    </Dropdown>
  );
};
