import type { Route } from "next";

export const buildAuthUrl = (
  base: "/sign-in" | "/sign-up",
  next?: string,
): Route => {
  if (!next) {
    return base;
  }
  return `${base}?next=${encodeURIComponent(next)}`;
};
