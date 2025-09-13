"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import { selectOnePersonalizedCollectionById } from "@/database/collection";
import {
  insertOneCollectionItem,
  selectManyEnrichedCollectionItemsByCollectionId,
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
