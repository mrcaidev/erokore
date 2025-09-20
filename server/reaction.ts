"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import type { Attitude } from "@/database/types";
import { selectOnePersonalizedCollectionById } from "@/repository/collection";
import { selectOneCollectionItemById } from "@/repository/collection-item";
import { upsertOneReaction } from "@/repository/reaction";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";

export type ReactToCollectionItemRequest = {
  collectionItemId: number;
  attitude?: Attitude | null;
  comment?: string;
};

export const reactToCollectionItem = async (
  req: ReactToCollectionItemRequest,
) => {
  const session = await getSession();

  const collectionItem = await selectOneCollectionItemById(
    req.collectionItemId,
  );

  if (!collectionItem) {
    return { error: "作品不存在，可能刚刚被删掉了" };
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

  if (!hasPermission(collection, "rater")) {
    return { error: "当前身份没法评价作品哦" };
  }

  await upsertOneReaction({
    reactorId: session.id,
    collectionItemId: req.collectionItemId,
    ...(req.attitude !== undefined ? { attitude: req.attitude } : {}),
    ...(req.comment !== undefined ? { comment: req.comment } : {}),
  });

  revalidatePath(`/collections/${collection.slug}`);

  return undefined;
};
