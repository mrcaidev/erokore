import type { CollectionItem } from "@/database/types";

export type SourceConfig<T = unknown> = {
  source: string;
  name?: string;
  rules?: {
    match: (input: string) => T | undefined;
    priority?: number;
  }[];
  scrape?: (
    id: T,
  ) => Promise<
    Pick<CollectionItem, "title" | "description" | "url" | "coverUrl">
  >;
  badge?: {
    icon?: "image" | "video";
    className?: string;
  };
};
