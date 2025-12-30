import React, { createContext, useContext } from "react";
import { notification, type NotificationArgsProps } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

export interface NotificationContextType {
  success: (config: NotificationArgsProps) => void;
  info: (config: NotificationArgsProps) => void;
  warning: (config: NotificationArgsProps) => void;
  error: (config: NotificationArgsProps) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  success: () => console.warn("NotificationProvider not mounted"),
  info: () => console.warn("NotificationProvider not mounted"),
  warning: () => console.warn("NotificationProvider not mounted"),
  error: () => console.warn("NotificationProvider not mounted")
});

//TODO: config notification
const createNotificationConfig = (config: NotificationArgsProps, type: NotificationType): NotificationArgsProps => {
  return {
    ...config,
    type,
    title: <div className="title">{config.title}</div>
  };
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const open = (type: NotificationType) => (config: NotificationArgsProps) => {
    api[type](createNotificationConfig(config, type));
  };

  const value: NotificationContextType = {
    success: open("success"),
    info: open("info"),
    warning: open("warning"),
    error: open("error")
  };

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => useContext(NotificationContext);
