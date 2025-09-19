"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import { selectOnePersonalizedCollectionById } from "@/database/collection";
import {
  insertOneCollectionItem,
  selectManyPersonalizedCollectionItemsByCollectionId,
  selectOneCollectionItemById,
  updateOneCollectionItemById,
} from "@/database/collection-item";
import { hasPermission } from "@/utils/permission";
import { findCurrentUser } from "./auth";

export const listPersonalizedCollectionItemsByCollectionId = async (
  collectionId: number,
) => {
  const user = await findCurrentUser();

  const collection = await selectOnePersonalizedCollectionById(
    collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  const collectionItems =
    await selectManyPersonalizedCollectionItemsByCollectionId(
      collectionId,
      user?.id,
    );
  return collectionItems;
};

export type CreateCollectionItemRequest = {
  collectionId: number;
  source: string;
  title: string;
  description: string;
  url: string;
  coverUrl: string;
};

export const createCollectionItem = async (
  req: CreateCollectionItemRequest,
) => {
  const user = await findCurrentUser();

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!user) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "contributor")) {
    return forbidden();
  }

  await insertOneCollectionItem({
    ...req,
    creatorId: user.id,
    updaterId: user.id,
  });

  revalidatePath(`/collections/${collection.slug}`);
};

export type EditCollectionItemRequest = CreateCollectionItemRequest & {
  id: number;
};

export const editCollectionItem = async (req: EditCollectionItemRequest) => {
  const user = await findCurrentUser();

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!user) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "contributor")) {
    return forbidden();
  }

  await updateOneCollectionItemById(req.id, {
    source: req.source,
    title: req.title,
    description: req.description,
    url: req.url,
    coverUrl: req.coverUrl,
    updaterId: user.id,
  });

  revalidatePath(`/collections/${collection.slug}`);
};

export const deleteCollectionItem = async (id: number) => {
  const user = await findCurrentUser();

  const collectionItem = await selectOneCollectionItemById(id);

  if (!collectionItem) {
    return notFound();
  }

  const collection = await selectOnePersonalizedCollectionById(
    collectionItem.collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!user) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "contributor")) {
    return forbidden();
  }

  await updateOneCollectionItemById(id, {
    deletedAt: new Date(),
    deleterId: user.id,
  });

  revalidatePath(`/collections/${collection.slug}`);
};
