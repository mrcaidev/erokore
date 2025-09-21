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

export const normalizePage = (page: string | undefined) => {
  const pageNumber = Number(page);
  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return Math.floor(pageNumber);
};
