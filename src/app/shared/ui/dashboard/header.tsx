import { Layout, theme } from "antd";
import React from "react";

export function DashboardHeader() {
  const { token } = theme.useToken();
  const { Header } = Layout;

  const headerStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 1,
    width: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: token.colorBgContainer,
  };

  return <Header style={headerStyle} />;
}
