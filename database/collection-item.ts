import { and, eq, isNull } from "drizzle-orm";
import type { CollectionItem } from "@/utils/types";
import { db } from "./client";
import { collectionItemsTable } from "./schema";

export const selectManyEnrichedCollectionItemsByCollectionId = async (
  collectionId: number,
) => {
  const collectionItems = await db.query.collectionItemsTable.findMany({
    with: {
      creator: {
        columns: {
          id: true,
          slug: true,
          email: true,
          nickname: true,
          avatarUrl: true,
        },
      },
      updater: {
        columns: {
          id: true,
          slug: true,
          email: true,
          nickname: true,
          avatarUrl: true,
        },
      },
    },
    where: (collectionItemsTable, { eq }) =>
      and(
        eq(collectionItemsTable.collectionId, collectionId),
        isNull(collectionItemsTable.deletedAt),
      ),
    orderBy: (collectionItemsTable, { desc }) => [
      desc(collectionItemsTable.createdAt),
    ],
  });
  return collectionItems;
};

export const selectOneCollectionItemById = async (id: number) => {
  const collectionItem = await db.query.collectionItemsTable.findFirst({
    where: (collectionItemsTable, { eq }) =>
      and(
        eq(collectionItemsTable.id, id),
        isNull(collectionItemsTable.deletedAt),
      ),
  });
  return collectionItem;
};

export const insertOneCollectionItem = async (
  value: typeof collectionItemsTable.$inferInsert,
) => {
  const [collectionItem] = await db
    .insert(collectionItemsTable)
    .values(value)
    .returning();
  return collectionItem;
};

export const updateOneCollectionItemById = async (
  id: number,
  value: Partial<CollectionItem>,
) => {
  await db
    .update(collectionItemsTable)
    .set(value)
    .where(eq(collectionItemsTable.id, id));
};
