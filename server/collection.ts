"use server";

import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/database/client";
import { collectionsTable } from "@/database/schema";
import { findCurrentUser } from "./user";

export const findCollectionBySlug = cache(async (slug: string) => {
  const collection = await db.query.collectionsTable.findFirst({
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
    where: (collectionsTable, { and, eq, isNull }) =>
      and(eq(collectionsTable.slug, slug), isNull(collectionsTable.deletedAt)),
  });
  return collection;
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

  return redirect(`/collections/${collection.slug}`);
};
