/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from "react";
import type { NotificationArgsProps } from "antd";
import { useCustomNotification } from "@/components/customize/customNotification";

interface NotificationContextType {
  success: (config: NotificationArgsProps) => void;
  info: (config: NotificationArgsProps) => void;
  warning: (config: NotificationArgsProps) => void;
  error: (config: NotificationArgsProps) => void;
}

const defaultContextValue: NotificationContextType = {
  success: () => console.warn("Notification Provider not mounted"),
  info: () => console.warn("Notification Provider not mounted"),
  warning: () => console.warn("Notification Provider not mounted"),
  error: () => console.warn("Notification Provider not mounted")
};

export const NotificationContext = createContext<NotificationContextType>(defaultContextValue);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { contextHolder, success, info, warning, error } = useCustomNotification();

  const contextValue: NotificationContextType = {
    success,
    info,
    warning,
    error
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};
