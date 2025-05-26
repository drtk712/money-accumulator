import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "实时工资计算器 - 让每一分钟都有价值",
  description: "一个酷炫的实时工资显示网站，实时计算你今天已经赚到的工资",
  keywords: "工资计算器,实时工资,薪资计算,工作时间,收入统计",
  authors: [{ name: "工资计算器" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
