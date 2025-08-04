"use client";
import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Layout } from "antd";
import {
  DashboardContent,
  DashboardFooter,
  DashboardHeader,
  DashboardSidebar,
} from ".";

export interface DashboardLayoutProps {
  children: React.ReactNode;
}
export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Layout hasSider>
      <DashboardSidebar />
      <Layout>
        <DashboardHeader />
        <DashboardContent>{children}</DashboardContent>
        <DashboardFooter />
      </Layout>
    </Layout>
  );
};
