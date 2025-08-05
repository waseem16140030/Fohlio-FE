import { Layout, theme, Typography } from "antd";
import React from "react";

export function DashboardFooter() {
  const { token } = theme.useToken();
  const { Footer } = Layout;
  const { Text } = Typography;

  const footerStyle: React.CSSProperties = {
    backgroundColor: token.colorBgContainer,
    textAlign: "center",
    borderColor: token.colorBorder,
  };

  return (
    <Footer className="tw:!border-t-1" style={footerStyle}>
      <Text>Fohlio ©{new Date().getFullYear()} by Waseem</Text>
    </Footer>
  );
}
