import { db } from "./client";
import { collectionsTable } from "./schema";

export const findOneCollectionBySlug = async (slug: string) => {
  const collection = await db.query.collectionsTable.findFirst({
    where: (collectionsTable, { and, eq, isNull }) =>
      and(eq(collectionsTable.slug, slug), isNull(collectionsTable.deletedAt)),
  });
  return collection;
};

export const insertOneCollection = async (
  value: typeof collectionsTable.$inferInsert,
) => {
  const [collection] = await db
    .insert(collectionsTable)
    .values(value)
    .returning();
  return collection;
};
