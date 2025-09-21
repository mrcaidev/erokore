import { eq } from "drizzle-orm";
import type {
  Collection,
  InsertCollection,
  UpdateCollection,
  User,
} from "@/utils/types";
import { db } from "./client";
import { collectionsTable } from "./schema";

export const selectOnePersonalizedCollectionById = async (
  id: Collection["id"],
  userId: User["id"] | undefined,
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
  const collection = {
    ...rest,
    myPermissionLevel: collaborations[0]?.permissionLevel ?? null,
    mySubscribed: subscriptions.length > 0,
  };
  return collection;
};

export const selectOnePersonalizedCollectionBySlug = async (
  slug: Collection["slug"],
  userId: User["id"] | undefined,
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
  const collection = {
    ...rest,
    myPermissionLevel: collaborations[0]?.permissionLevel ?? null,
    mySubscribed: subscriptions.length > 0,
  };
  return collection;
};

export const selectOneCollectionWithMyPermissionLevelById = async (
  id: Collection["id"],
  userId: User["id"] | undefined,
) => {
  const row = await db.query.collectionsTable.findFirst({
    with: {
      ...(userId
        ? {
            collaborations: {
              where: (collaborationsTable, { eq }) =>
                eq(collaborationsTable.collaboratorId, userId),
            },
          }
        : {}),
    },
    where: (collectionsTable, { and, eq, isNull }) =>
      and(eq(collectionsTable.id, id), isNull(collectionsTable.deletedAt)),
  });

  if (!row) {
    return undefined;
  }

  const { collaborations, ...rest } = row;
  const collection = {
    ...rest,
    myPermissionLevel: collaborations?.[0]?.permissionLevel ?? null,
  };
  return collection;
};

export const selectOneCollectionWithMyPermissionLevelBySlug = async (
  slug: Collection["slug"],
  userId: User["id"] | undefined,
) => {
  const row = await db.query.collectionsTable.findFirst({
    with: {
      ...(userId
        ? {
            collaborations: {
              where: (collaborationsTable, { eq }) =>
                eq(collaborationsTable.collaboratorId, userId),
            },
          }
        : {}),
    },
    where: (collectionsTable, { and, eq, isNull }) =>
      and(eq(collectionsTable.slug, slug), isNull(collectionsTable.deletedAt)),
  });

  if (!row) {
    return undefined;
  }

  const { collaborations, ...rest } = row;
  const collection = {
    ...rest,
    myPermissionLevel: collaborations?.[0]?.permissionLevel ?? null,
  };
  return collection;
};

export const insertOneCollection = async (value: InsertCollection) => {
  const [collection] = await db
    .insert(collectionsTable)
    .values(value)
    .returning();
  return collection;
};

export const updateOneCollectionById = async (
  id: Collection["id"],
  value: UpdateCollection,
) => {
  await db
    .update(collectionsTable)
    .set(value)
    .where(eq(collectionsTable.id, id));
};
