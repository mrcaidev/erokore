import type { NextConfig } from "next";

export default {
  typedRoutes: true,
  experimental: {
    authInterrupts: true,
    typedEnv: true,
  },
} satisfies NextConfig;
