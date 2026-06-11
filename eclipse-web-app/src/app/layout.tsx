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
      <body style={{ margin: 0, padding: 0, overflow: "hidden", background: "#000" }}>
        {children}
      </body>
    </html>
  );
}
