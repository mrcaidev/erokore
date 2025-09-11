import type { PropsWithChildren } from "react";
import "./global.css";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh">
      <head>
        <title>Pornmate</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
