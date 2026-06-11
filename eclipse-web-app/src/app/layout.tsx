import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eclipse Online Judge",
  description: "Eclipse IDE running in WebAssembly via CheerpJ 3.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 
          Turbopack/Webpack의 ESM 모듈 간섭을 원천 방지하기 위해 
          고전적인 CDN 스크립트 태그 방식으로 로드합니다.
        */}
        <script src="https://cjrtnc.leaningtech.com/3.0/loader.js" defer></script>
      </head>
      <body style={{ margin: 0, padding: 0, overflow: "hidden", background: "#000" }}>
        {children}
      </body>
    </html>
  );
}
