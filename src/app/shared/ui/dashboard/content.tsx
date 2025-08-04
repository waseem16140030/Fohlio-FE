import { Layout } from "antd";
import React from "react";
export interface DashboardContentProps {
  children: React.ReactNode;
}
export function DashboardContent({ children }: DashboardContentProps) {
  const { Content } = Layout;
  return (
    <Content className="tw:m-3 tw:md:m-4 tw:lg:m-6 tw:xl:m-7 tw:overflow-y-scroll" >
      {children}
    </Content>
  );
}
