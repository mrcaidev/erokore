"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import { cache } from "react";
import { insertOneCollaboration } from "@/database/collaboration";
import {
  insertOneCollection,
  selectOnePersonalizedCollectionById,
  selectOnePersonalizedCollectionBySlug,
  updateOneCollectionById,
} from "@/database/collection";
import { insertOneSubscription } from "@/database/subscription";
import { hasPermission } from "@/utils/permission";
import type { PermissionLevel } from "@/utils/types";
import { findCurrentUser } from "./auth";

export const findCollection = cache(async (slug: string) => {
  const user = await findCurrentUser();

  const collection = await selectOnePersonalizedCollectionBySlug(
    slug,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  return collection;
});

type CreateCollectionRequest = {
  title: string;
  description: string;
  collaboratorPermissionLevel: PermissionLevel;
  anyonePermissionLevel: PermissionLevel;
};

export const createCollection = async ({
  title,
  description,
  collaboratorPermissionLevel,
  anyonePermissionLevel,
}: CreateCollectionRequest) => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect(
      `/sign-in?next=${encodeURIComponent("/collections/create")}`,
    );
  }

  const collection = await insertOneCollection({
    title,
    description,
    collaboratorPermissionLevel,
    anyonePermissionLevel,
    creatorId: user.id,
    updaterId: user.id,
  });

  if (!collection) {
    return { error: "创建失败，请稍后重试" };
  }

  await Promise.all([
    // 自动将创建者加入协作者列表
    insertOneCollaboration({
      collaboratorId: user.id,
      collectionId: collection.id,
      permissionLevel: "owner",
    }),
    // 自动为创建者关注作品集
    insertOneSubscription({
      subscriberId: user.id,
      collectionId: collection.id,
    }),
  ]);

  return redirect(`/collections/${collection.slug}`);
};

export type EditCollectionRequest = {
  id: number;
  title?: string;
  description?: string;
  collaboratorPermissionLevel?: PermissionLevel;
  anyonePermissionLevel?: PermissionLevel;
};

export const editCollection = async ({
  id,
  title,
  description,
  collaboratorPermissionLevel,
  anyonePermissionLevel,
}: EditCollectionRequest) => {
  const user = await findCurrentUser();

  const collection = await selectOnePersonalizedCollectionById(id, user?.id);

  if (!collection) {
    return notFound();
  }

  if (!user) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}/edit`)}`,
    );
  }

  if (!hasPermission(collection, "admin")) {
    return forbidden();
  }

  await updateOneCollectionById(id, {
    title,
    description,
    collaboratorPermissionLevel,
    anyonePermissionLevel,
    updaterId: user.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return redirect(`/collections/${collection.slug}`);
};

export const deleteCollection = async (id: number) => {
  const user = await findCurrentUser();

  const collection = await selectOnePersonalizedCollectionById(id, user?.id);

  if (!collection) {
    return notFound();
  }

  if (!user) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "owner")) {
    return forbidden();
  }

  await updateOneCollectionById(id, {
    deletedAt: new Date(),
    deleterId: user.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return redirect("/");
};
