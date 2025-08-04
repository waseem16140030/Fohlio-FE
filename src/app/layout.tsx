import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClientProvider, ThemeProvider } from "@/app/providers";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { DashboardLayout } from "@/app/shared";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Brand-Compliant Product & Materials Library",
    template: "%s | Fohlio",
  },
  description: "Brand Specification and Procurement Software",
};



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} App antialiased`}>
        <AntdRegistry>
          <ThemeProvider>
            <ClientProvider>
              <DashboardLayout>{children}</DashboardLayout>
            </ClientProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
