import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/database/client";
import { collectionItemsTable } from "@/database/schema";
import type {
  CollectionItem,
  PersonalizedCollectionItem,
} from "@/database/types";

export const selectManyPersonalizedCollectionItemsByCollectionId = async (
  collectionId: number,
  userId: number | undefined,
) => {
  const rows = await db.query.collectionItemsTable.findMany({
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
      reactions: {
        columns: {
          attitude: true,
          comment: true,
        },
        where: (reactionsTable, { eq }) =>
          eq(reactionsTable.reactorId, userId ?? -1),
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

  return rows.map((row) => {
    const { reactions, ...rest } = row;
    const collectionItem: PersonalizedCollectionItem = {
      ...rest,
      my: {
        attitude: reactions[0]?.attitude ?? null,
        comment: reactions[0]?.comment ?? "",
      },
    };
    return collectionItem;
  });
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
