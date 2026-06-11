/**
 * 全体レイアウト・Webページ本体
 * Reactではこの中身のDOMを差分検知して更新している（SPA）
 */

import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
