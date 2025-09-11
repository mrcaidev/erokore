import type { PropsWithChildren } from "react";
import "./global.css";
import "@fontsource/noto-sans-sc";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <title>Erokore</title>
      </head>
      <body>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
