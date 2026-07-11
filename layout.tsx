import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "理理 — AI 情侣吵架评理",
  description: "吵架了？我来评评理。AI 帮你理清思路，不伤感情。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
