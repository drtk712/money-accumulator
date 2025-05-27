import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "💎 财富累积器 - 看着您的财富每秒增长！",
  description: "一个让您实时感受财富增长的应用！支持多种货币显示，标题栏隐秘显示收入，领导在也不怕！",
  keywords: "财富累积器,实时收入,工资计算,多货币显示,隐秘查看,薪资统计",
  authors: [{ name: "财富累积器" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
