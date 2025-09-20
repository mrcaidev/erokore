import { eq } from "drizzle-orm";
import { db } from "@/database/client";
import { collectionsTable } from "@/database/schema";
import type { PersonalizedCollection } from "@/database/types";

export const selectOnePersonalizedCollectionById = async (
  id: number,
  userId: number | undefined,
) => {
  const row = await db.query.collectionsTable.findFirst({
    with: {
      collaborations: {
        where: (collaborationsTable, { eq }) =>
          eq(collaborationsTable.collaboratorId, userId ?? -1),
      },
      subscriptions: {
        where: (subscriptionsTable, { eq }) =>
          eq(subscriptionsTable.subscriberId, userId ?? -1),
      },
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
    where: (collectionsTable, { and, eq, isNull }) =>
      and(eq(collectionsTable.id, id), isNull(collectionsTable.deletedAt)),
  });

  if (!row) {
    return undefined;
  }

  const { collaborations, subscriptions, ...rest } = row;
  const collection: PersonalizedCollection = {
    ...rest,
    my: {
      permissionLevel: collaborations[0]?.permissionLevel ?? null,
      subscribed: subscriptions.length > 0,
    },
  };
  return collection;
};

export const selectOnePersonalizedCollectionBySlug = async (
  slug: string,
  userId: number | undefined,
) => {
  const row = await db.query.collectionsTable.findFirst({
    with: {
      collaborations: {
        where: (collaborationsTable, { eq }) =>
          eq(collaborationsTable.collaboratorId, userId ?? -1),
      },
      subscriptions: {
        where: (subscriptionsTable, { eq }) =>
          eq(subscriptionsTable.subscriberId, userId ?? -1),
      },
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
    where: (collectionsTable, { and, eq, isNull }) =>
      and(eq(collectionsTable.slug, slug), isNull(collectionsTable.deletedAt)),
  });

  if (!row) {
    return undefined;
  }

  const { collaborations, subscriptions, ...rest } = row;
  const collection: PersonalizedCollection = {
    ...rest,
    my: {
      permissionLevel: collaborations[0]?.permissionLevel ?? null,
      subscribed: subscriptions.length > 0,
    },
  };
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

export const updateOneCollectionById = async (
  id: number,
  value: Partial<typeof collectionsTable.$inferInsert>,
) => {
  await db
    .update(collectionsTable)
    .set(value)
    .where(eq(collectionsTable.id, id));
};
