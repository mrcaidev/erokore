"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { selectOnePersonalizedCollectionById } from "@/database/collection";
import { selectOneCollectionItemById } from "@/database/collection-item";
import { upsertOneReaction } from "@/database/reaction";
import { hasPermission } from "@/utils/permission";
import type { Attitude } from "@/utils/types";
import { findCurrentUser } from "./auth";

export type ReactToCollectionItemRequest = {
  collectionItemId: number;
  attitude?: Attitude | null;
  comment?: string;
};

export const reactToCollectionItem = async (
  req: ReactToCollectionItemRequest,
) => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const collectionItem = await selectOneCollectionItemById(
    req.collectionItemId,
  );

  if (!collectionItem) {
    return { error: "作品不存在，可能刚刚被删掉了" };
  }

  const collection = await selectOnePersonalizedCollectionById(
    collectionItem.collectionId,
    user.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "rater")) {
    return { error: "当前身份没法评价作品哦" };
  }

  await upsertOneReaction({
    reactorId: user.id,
    collectionItemId: req.collectionItemId,
    ...(req.attitude !== undefined ? { attitude: req.attitude } : {}),
    ...(req.comment !== undefined ? { comment: req.comment } : {}),
  });

  revalidatePath(`/collections/${collection.slug}`);

  return undefined;
};
