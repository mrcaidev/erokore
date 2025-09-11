import type { NextConfig } from "next";

export default {
  typedRoutes: true,
  experimental: {
    typedEnv: true,
  },
} satisfies NextConfig;
