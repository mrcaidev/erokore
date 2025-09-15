import type { NextConfig } from "next";

export default {
  images: {
    remotePatterns: [new URL("https://fourhoi.com/**")],
  },
  typedRoutes: true,
  experimental: {
    authInterrupts: true,
    typedEnv: true,
  },
} satisfies NextConfig;
