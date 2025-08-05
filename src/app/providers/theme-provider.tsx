"use client";

import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { defaultToken } from "@/app/shared";
import { useEffect, useState } from "react";

function ThemeContent({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ConfigProvider
        theme={{
          token: defaultToken,
          algorithm: antdTheme.defaultAlgorithm,
        }}
      >
        {children}
      </ConfigProvider>
    );
  }

  const themeForAntd = resolvedTheme === "dark" 
    ? antdTheme.darkAlgorithm 
    : antdTheme.defaultAlgorithm;

  return (
    <ConfigProvider
      theme={{
        token: defaultToken,
        algorithm: themeForAntd,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <ThemeContent>{children}</ThemeContent>
    </NextThemesProvider>
  );
}