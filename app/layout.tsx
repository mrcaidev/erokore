import type { PropsWithChildren } from "react";
import "./global.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <title>Pornmate</title>
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
