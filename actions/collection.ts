"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import type { PermissionLevel } from "@/database/types";
import { insertOneCollaboration } from "@/repository/collaboration";
import {
  insertOneCollection,
  selectOnePersonalizedCollectionById,
  updateOneCollectionById,
} from "@/repository/collection";
import { insertOneSubscription } from "@/repository/subscription";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";

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
  const session = await getSession();

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent("/collections/create")}`,
    );
  }

  const collection = await insertOneCollection({
    title,
    description,
    collaboratorPermissionLevel,
    anyonePermissionLevel,
    creatorId: session.id,
    updaterId: session.id,
  });

  if (!collection) {
    return { error: "创建失败，请稍后重试" };
  }

  await Promise.all([
    // 自动将创建者加入协作者列表
    insertOneCollaboration({
      collaboratorId: session.id,
      collectionId: collection.id,
      permissionLevel: "owner",
    }),
    // 自动为创建者关注作品集
    insertOneSubscription({
      subscriberId: session.id,
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
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionById(id, session?.id);

  if (!collection) {
    return notFound();
  }

  if (!session) {
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
    updaterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return redirect(`/collections/${collection.slug}`);
};

export const deleteCollection = async (id: number) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionById(id, session?.id);

  if (!collection) {
    return notFound();
  }

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "owner")) {
    return forbidden();
  }

  await updateOneCollectionById(id, {
    deletedAt: new Date(),
    deleterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return redirect("/");
};
