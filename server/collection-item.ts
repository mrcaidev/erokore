"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import { selectOnePersonalizedCollectionById } from "@/database/collection";
import {
  insertOneCollectionItem,
  selectManyEnrichedCollectionItemsByCollectionId,
  selectOneCollectionItemById,
  updateOneCollectionItemById,
} from "@/database/collection-item";
import { hasPermission } from "@/utils/permission";
import type { Source } from "@/utils/types";
import { findCurrentUser } from "./auth";

export const listEnrichedCollectionItemsByCollectionId = async (
  collectionId: number,
) => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

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
    await selectManyEnrichedCollectionItemsByCollectionId(collectionId);
  return collectionItems;
};

export type CreateCollectionItemRequest = {
  collectionId: number;
  source: Source;
  title: string;
  description: string;
  url: string;
  coverUrl: string;
};

export const createCollectionItem = async (
  req: CreateCollectionItemRequest,
) => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
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

  if (!user) {
    return redirect("/sign-in");
  }

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
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

  if (!user) {
    return redirect("/sign-in");
  }

  const collectionItem = await selectOneCollectionItemById(id);

  if (!collectionItem) {
    return notFound();
  }

  const collection = await selectOnePersonalizedCollectionById(
    collectionItem.collectionId,
    user.id,
  );

  if (!collection) {
    return notFound();
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
