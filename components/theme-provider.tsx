"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

export function ThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemeProvider attribute="class" disableTransitionOnChange>
      {children}
    </NextThemeProvider>
  );
}
