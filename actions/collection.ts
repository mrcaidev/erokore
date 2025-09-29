"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { insertOneCollaboration } from "@/database/collaboration";
import {
  insertOneCollection,
  selectOneCollectionWithMyPermissionLevelBySlug,
  updateOneCollectionById,
} from "@/database/collection";
import { insertOneSubscription } from "@/database/subscription";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import type {
  Collection,
  InsertCollection,
  UpdateCollection,
} from "@/utils/types";
import { buildRelativeUrl } from "@/utils/url";

export const createCollection = async (
  value: Pick<
    InsertCollection,
    | "title"
    | "description"
    | "collaboratorPermissionLevel"
    | "anyonePermissionLevel"
  >,
) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      buildRelativeUrl("/sign-in", { next: "/collections/create" }),
    );
  }

  const collection = await insertOneCollection({
    ...value,
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

export const editCollection = async (
  slug: Collection["slug"],
  value: UpdateCollection,
) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      buildRelativeUrl("/sign-in", { next: `/collections/${slug}/edit` }),
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    slug,
    session.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!hasPermission(collection, "admin")) {
    return { error: "没有权限" };
  }

  await updateOneCollectionById(collection.id, {
    ...value,
    updaterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return redirect(`/collections/${collection.slug}`);
};

export const removeCollection = async (slug: Collection["slug"]) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      buildRelativeUrl("/sign-in", { next: `/collections/${slug}` }),
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    slug,
    session.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!hasPermission(collection, "owner")) {
    return { error: "没有权限" };
  }

  await updateOneCollectionById(collection.id, {
    deletedAt: new Date(),
    deleterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return redirect("/");
};
