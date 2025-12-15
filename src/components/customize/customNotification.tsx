import { notification, type NotificationArgsProps } from "antd";

type NotificationProps = NotificationArgsProps;

/**
 * Hàm tạo cấu hình notification chung
 */
const createNotificationConfig = (
  config: NotificationProps,
  type: "success" | "info" | "warning" | "error"
): NotificationProps => {
  const isOnlyTitle = !config.description;

  const customTitle = <div className={`title ${isOnlyTitle ? "title-only" : ""}`}>{config.title}</div>;

  const customDescription = config.description ? <div className="description">{config.description}</div> : <div />;

  return {
    ...config,
    title: customTitle,
    description: customDescription,
    classNames: config.description ? config.classNames : `notification-without-description ${config.classNames || ""}`,
    type: type,
    showProgress: true
  };
};

/**
 * Custom Hook để quản lý Notification instance
 */
export const useCustomNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: "success" | "info" | "warning" | "error", config: NotificationProps) => {
    const finalConfig = createNotificationConfig(config, type);

    api[type](finalConfig);
  };

  return {
    contextHolder,
    success: (config: NotificationProps) => openNotification("success", config),
    info: (config: NotificationProps) => openNotification("info", config),
    warning: (config: NotificationProps) => openNotification("warning", config),
    error: (config: NotificationProps) => openNotification("error", config)
  };
};
