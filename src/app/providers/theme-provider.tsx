"use client";
import { ConfigProvider } from "antd";
import { defaultThemeConfigs } from "@/app/shared";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={defaultThemeConfigs}>{children}</ConfigProvider>
  );
}
