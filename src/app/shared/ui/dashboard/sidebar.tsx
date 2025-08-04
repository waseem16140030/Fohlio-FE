"use client";
import { Layout, Menu, MenuProps, theme } from "antd";
import React from "react";
import {
  BarChartOutlined,
  BellOutlined,
  CreditCardOutlined,
  MessageOutlined,
  NotificationOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { authKey } from "@/app/config";
import appIcon from "@root/public/fohlio.svg";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { push } = useRouter();
  const { token } = theme.useToken();
  const { Sider } = Layout;

  const siderStyle: React.CSSProperties = {
    insetInlineStart: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    backgroundColor: token.colorBgContainer,
  };

  const items: MenuProps["items"] = [
    {
      key: authKey.USERS_MANAGEMENT,
      label: "User Management",
      icon: <UsergroupAddOutlined />,
    },
    {
      key: authKey.PUSH_NOTIFICATIONS,
      label: "Push Notifications",
      icon: <BellOutlined />,
    },
    {
      key: authKey.EMAIL_SYSTEM,
      label: "Email System",
      icon: <MessageOutlined />,
    },
    {
      key: authKey.SUBSCRIPTIONS,
      label: "Subscriptions",
      icon: <CreditCardOutlined />,
    },
    {
      key: authKey.TEAM_ACCESS,
      label: "Team Access",
      icon: <SecurityScanOutlined />,
    },
    { key: authKey.ANALYTICS, label: "Analytics", icon: <BarChartOutlined /> },
    {
      key: authKey.USER_SUPPORT,
      label: "User Support",
      icon: <NotificationOutlined />,
    },
    { key: authKey.SETTINGS, label: "Settings", icon: <SettingOutlined /> },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    push(key);
  };

  return (
    <Sider
      width={250}
      breakpoint="lg"
      style={siderStyle}
      className="tw:overflow-auto tw:h-screen tw:!sticky tw:top-0 tw:bottom-0"
    >
      <div className="tw:h-16 tw:flex tw:items-center tw:border-b tw:border-r tw:border-gray-100 tw:px-6 tw:mb-2 tw:lg:mb-4">
        <Link href={authKey.USERS_MANAGEMENT}>
          <Image src={appIcon} alt="Fohlio icon" height={64} width={120} />
        </Link>
      </div>
      <Menu
        selectedKeys={[pathname]}
        onClick={handleMenuClick}
        mode="inline"
        defaultSelectedKeys={[authKey.USERS_MANAGEMENT]}
        items={items}
      />
    </Sider>
  );
}
