import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "블로그 → 숏폼 | 콘텐츠 입력",
  description: "블로그 URL 또는 본문을 입력해 숏폼 영상 초안을 만듭니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
