"use client";
import { notification, NotificationArgsProps } from "antd";
import { capitalize } from "lodash";
import React, { createContext, useContext } from "react";

type NotificationType = "success" | "info" | "warning" | "error";
export interface NotificationProps
  extends Omit<NotificationArgsProps, "message"> {
  type: NotificationType;
  message?: string;
  description?: string;
}

type NotificationContextType = {
  openNotification: (notification: NotificationProps) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useGlobalNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useGlobalNotification must be used within NotificationProvider"
    );
  return ctx;
};

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = ({
    message,
    description,
    type,
    ...restProps
  }: NotificationProps) => {
    api[type]({
      message: message ?? capitalize(type),
      description,
      placement: "bottomRight",
      className: "tw:!text-sm",
      ...restProps,
    });
  };

  return (
    <NotificationContext.Provider value={{ openNotification }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
}
