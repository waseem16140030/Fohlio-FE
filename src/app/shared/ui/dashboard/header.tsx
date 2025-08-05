import {
  Avatar,
  Divider,
  Dropdown,
  Layout,
  MenuProps,
  Segmented,
  theme,
  Typography,
} from "antd";
import React from "react";

import {
  EditOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { SearchInput } from "@/app/shared/ui";
import { useTheme } from "next-themes";

export function DashboardHeader() {
  const { theme: userTheme, setTheme, resolvedTheme } = useTheme();
  const { token } = theme.useToken();
  const { Header } = Layout;
  const { Text } = Typography;

  const initialTheme = resolvedTheme || "light";
  const appliedTheme = userTheme === "system" ? resolvedTheme : userTheme;

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: token.colorBgContainer,
    borderColor: token.colorBorder,
  };

  const menuStyle: React.CSSProperties = {
    boxShadow: "none",
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    minWidth: 260,
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "edit-profile",
      label: "Edit Profile",
      icon: <EditOutlined />,
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <Header
      style={headerStyle}
      className="tw:!px-3 tw:md:!px-4 tw:lg:!px-6 tw:xl:!px-7 tw:!border-b-1"
    >
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-x-4 tw:w-full">
        <div className="tw:w-1/4">
          <SearchInput variant="borderless" placeholder="Search..." />
        </div>
        <div className="tw:flex tw:items-center tw:gap-x-2">
          <Segmented
            value={userTheme === "system" ? resolvedTheme : userTheme}
            onChange={(value) =>
              setTheme(value === resolvedTheme ? "system" : value)
            }
            defaultValue={initialTheme}
            shape="round"
            options={[
              { value: "light", icon: <SunOutlined /> },
              { value: "dark", icon: <MoonOutlined /> },
            ]}
          />
          <Dropdown
            arrow
            menu={{ items }}
            trigger={["click"]}
            placement="bottomRight"
            popupRender={(menu) => (
              <div style={contentStyle}>
                <>
                  <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:p-4 tw:gap-y-1">
                    <Avatar size="large">M</Avatar>
                    <Text>Muhammad Waseem</Text>
                    <Text type="secondary">waseem16140030@gmail.com</Text>
                  </div>
                  <Divider
                    style={{
                      margin: 0,
                    }}
                  />
                  {React.cloneElement(
                    menu as React.ReactElement<{
                      style: React.CSSProperties;
                    }>,
                    { style: menuStyle }
                  )}
                </>
              </div>
            )}
          >
            <Avatar
              src="https://api.dicebear.com/7.x/miniavs/svg?seed=1"
              icon={<UserOutlined />}
              size={32}
              className="tw:cursor-pointer"
            >
              Muhammad Waseem
            </Avatar>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
}
