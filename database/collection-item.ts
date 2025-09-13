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
      eq(collectionItemsTable.collectionId, collectionId),
  });
  return collectionItems;
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
