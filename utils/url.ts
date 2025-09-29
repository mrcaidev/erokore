import type { Route } from "next";

export const buildRelativeUrl = (
  base: Route,
  query?: ConstructorParameters<typeof URLSearchParams>[0],
): Route => {
  const queryString = new URLSearchParams(query).toString();
  if (!queryString) {
    return base;
  }
  return `${base}?${queryString}`;
};

export const normalizePage = (page: unknown) => {
  const pageNumber = Number(page);
  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return 1;
  }
  return Math.floor(pageNumber);
};
