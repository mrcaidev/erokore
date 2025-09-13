"use server";

import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/database/client";
import {
  collaborationsTable,
  collectionsTable,
  subscriptionsTable,
} from "@/database/schema";
import type { PersonalizedCollection } from "@/utils/types";
import { findCurrentUser } from "./user";

export const findPersonalizedCollectionBySlug = cache(async (slug: string) => {
  const user = await findCurrentUser();

  const collection = await db.query.collectionsTable.findFirst({
    columns: {
      createdBy: false,
      updatedBy: false,
      deletedBy: false,
    },
    with: {
      collaborations: {
        columns: {
          permissionLevel: true,
          createdAt: true,
        },
        where: (collaborationsTable, { eq }) =>
          eq(collaborationsTable.userId, user?.id ?? -1),
      },
      subscriptions: {
        columns: {
          createdAt: true,
        },
        where: (subscriptionsTable, { eq }) =>
          eq(subscriptionsTable.userId, user?.id ?? -1),
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

  if (!collection) {
    return undefined;
  }

  const { collaborations, subscriptions, ...rest } = collection;
  const personalizedCollection: PersonalizedCollection = {
    ...rest,
    my: {
      permissionLevel: collaborations[0]?.permissionLevel ?? null,
      subscribed: subscriptions.length > 0,
    },
  };
  return personalizedCollection;
});

type CreateCollectionRequest = {
  title: string;
  description: string;
};

export const createCollection = async ({
  title,
  description,
}: CreateCollectionRequest) => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const [collection] = await db
    .insert(collectionsTable)
    .values({
      title,
      description,
      createdBy: user.id,
      updatedBy: user.id,
    })
    .returning();

  if (!collection) {
    return { error: "创建失败，请稍后重试" };
  }

  await Promise.all([
    // 自动将创建者加入协作者列表
    db
      .insert(collaborationsTable)
      .values({
        userId: user.id,
        collectionId: collection.id,
        permissionLevel: "owner",
      }),
    // 自动为创建者关注作品集
    db
      .insert(subscriptionsTable)
      .values({
        userId: user.id,
        collectionId: collection.id,
      }),
  ]);

  return redirect(`/collections/${collection.slug}`);
};
