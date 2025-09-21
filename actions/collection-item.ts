"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  selectOneCollectionWithMyPermissionLevelById,
  selectOneCollectionWithMyPermissionLevelBySlug,
} from "@/database/collection";
import {
  insertOneCollectionItem,
  selectOneCollectionItemBySlug,
  updateOneCollectionItemById,
} from "@/database/collection-item";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import type {
  Collection,
  CollectionItem,
  InsertCollectionItem,
  UpdateCollectionItem,
} from "@/utils/types";
import { buildAuthUrl } from "@/utils/url";

export const createCollectionItem = async (
  collectionSlug: Collection["slug"],
  value: Pick<
    InsertCollectionItem,
    "source" | "title" | "description" | "url" | "coverUrl"
  >,
) => {
  const session = await getSession();

  if (!session) {
    return redirect(buildAuthUrl("/sign-in", `/collections/${collectionSlug}`));
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    collectionSlug,
    session.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!hasPermission(collection, "contributor")) {
    return { error: "没有权限" };
  }

  await insertOneCollectionItem({
    collectionId: collection.id,
    ...value,
    creatorId: session.id,
    updaterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return undefined;
};

export const editCollectionItem = async (
  slug: CollectionItem["slug"],
  value: UpdateCollectionItem,
) => {
  const session = await getSession();

  const collectionItem = await selectOneCollectionItemBySlug(slug);

  if (!collectionItem) {
    return { error: "作品不存在" };
  }

  const collection = await selectOneCollectionWithMyPermissionLevelById(
    collectionItem.collectionId,
    session?.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!session) {
    return redirect(
      buildAuthUrl("/sign-in", `/collections/${collection.slug}`),
    );
  }

  if (!hasPermission(collection, "contributor")) {
    return { error: "没有权限" };
  }

  await updateOneCollectionItemById(collectionItem.id, {
    ...value,
    updaterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return undefined;
};

export const removeCollectionItem = async (slug: CollectionItem["slug"]) => {
  const session = await getSession();

  const collectionItem = await selectOneCollectionItemBySlug(slug);

  if (!collectionItem) {
    return { error: "作品不存在" };
  }

  const collection = await selectOneCollectionWithMyPermissionLevelById(
    collectionItem.collectionId,
    session?.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!session) {
    return redirect(
      buildAuthUrl("/sign-in", `/collections/${collection.slug}`),
    );
  }

  if (!hasPermission(collection, "contributor")) {
    return { error: "没有权限" };
  }

  await updateOneCollectionItemById(collectionItem.id, {
    deletedAt: new Date(),
    deleterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return undefined;
};
