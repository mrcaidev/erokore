import { and, count, eq, isNull } from "drizzle-orm";
import type {
  CollectionItem,
  InsertCollectionItem,
  LimitOffsetOptions,
  UpdateCollectionItem,
  User,
} from "@/utils/types";
import { db } from "./client";
import { collectionItemsTable } from "./schema";

export const countCollectionItemsByCollectionId = async (
  collectionId: CollectionItem["collectionId"],
) => {
  const rows = await db
    .select({ count: count() })
    .from(collectionItemsTable)
    .where(
      and(
        eq(collectionItemsTable.collectionId, collectionId),
        isNull(collectionItemsTable.deletedAt),
      ),
    );
  return rows[0]?.count ?? 0;
};

export const selectManyPersonalizedCollectionItemsByCollectionId = async (
  collectionId: CollectionItem["collectionId"],
  userId: User["id"] | undefined,
  options: LimitOffsetOptions = {},
) => {
  const rows = await db.query.collectionItemsTable.findMany({
    with: {
      ...(userId
        ? {
            reactions: {
              where: (reactionsTable, { eq }) =>
                eq(reactionsTable.reactorId, userId),
            },
          }
        : {}),
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
    where: (collectionItemsTable, { and, eq, isNull }) =>
      and(
        eq(collectionItemsTable.collectionId, collectionId),
        isNull(collectionItemsTable.deletedAt),
      ),
    orderBy: (collectionItemsTable, { desc }) => [
      desc(collectionItemsTable.createdAt),
    ],
    limit: options.limit,
    offset: options.offset,
  });

  return rows.map((row) => {
    const { reactions, ...rest } = row;
    const collectionItem = {
      ...rest,
      myAttitude: reactions?.[0]?.attitude ?? null,
      myComment: reactions?.[0]?.comment ?? "",
    };
    return collectionItem;
  });
};

export const selectOneCollectionItemById = async (id: CollectionItem["id"]) => {
  const collectionItem = await db.query.collectionItemsTable.findFirst({
    where: (collectionItemsTable, { and, eq, isNull }) =>
      and(
        eq(collectionItemsTable.id, id),
        isNull(collectionItemsTable.deletedAt),
      ),
  });
  return collectionItem;
};

export const selectOneCollectionItemBySlug = async (
  slug: CollectionItem["slug"],
) => {
  const collectionItem = await db.query.collectionItemsTable.findFirst({
    where: (collectionItemsTable, { and, eq, isNull }) =>
      and(
        eq(collectionItemsTable.slug, slug),
        isNull(collectionItemsTable.deletedAt),
      ),
  });
  return collectionItem;
};

export const insertOneCollectionItem = async (value: InsertCollectionItem) => {
  const [collectionItem] = await db
    .insert(collectionItemsTable)
    .values(value)
    .returning();
  return collectionItem;
};

export const updateOneCollectionItemById = async (
  id: CollectionItem["id"],
  value: UpdateCollectionItem,
) => {
  await db
    .update(collectionItemsTable)
    .set(value)
    .where(eq(collectionItemsTable.id, id));
};
