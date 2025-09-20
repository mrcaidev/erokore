"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import { selectOnePersonalizedCollectionById } from "@/repository/collection";
import {
  insertOneCollectionItem,
  selectOneCollectionItemById,
  updateOneCollectionItemById,
} from "@/repository/collection-item";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";

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
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    session?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "contributor")) {
    return forbidden();
  }

  await insertOneCollectionItem({
    ...req,
    creatorId: session.id,
    updaterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);
};

export type EditCollectionItemRequest = CreateCollectionItemRequest & {
  id: number;
};

export const editCollectionItem = async (req: EditCollectionItemRequest) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    session?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!session) {
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
    updaterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);
};

export const deleteCollectionItem = async (id: number) => {
  const session = await getSession();

  const collectionItem = await selectOneCollectionItemById(id);

  if (!collectionItem) {
    return notFound();
  }

  const collection = await selectOnePersonalizedCollectionById(
    collectionItem.collectionId,
    session?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "contributor")) {
    return forbidden();
  }

  await updateOneCollectionItemById(id, {
    deletedAt: new Date(),
    deleterId: session.id,
  });

  revalidatePath(`/collections/${collection.slug}`);
};
