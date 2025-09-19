import type { NextConfig } from "next";

export default {
  images: {
    remotePatterns: [
      new URL("https://fourhoi.com/**"),
      new URL("https://*.jmapinodeudzn.net/media/albums/**"),
    ],
  },
  typedRoutes: true,
  experimental: {
    authInterrupts: true,
    typedEnv: true,
  },
} satisfies NextConfig;
