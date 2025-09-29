"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { selectOneCollectionWithMyPermissionLevelById } from "@/database/collection";
import { selectOneCollectionItemBySlug } from "@/database/collection-item";
import { upsertOneReaction } from "@/database/reaction";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import type { CollectionItem, Reaction } from "@/utils/types";
import { buildRelativeUrl } from "@/utils/url";

export const showAttitudeTowardsCollectionItem = async (
  collectionItemSlug: CollectionItem["slug"],
  attitude: Reaction["attitude"],
) => {
  const collectionItem =
    await selectOneCollectionItemBySlug(collectionItemSlug);

  if (!collectionItem) {
    return { error: "作品不存在" };
  }

  const session = await getSession();

  const collection = await selectOneCollectionWithMyPermissionLevelById(
    collectionItem.collectionId,
    session?.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!session) {
    return redirect(
      buildRelativeUrl("/sign-in", { next: `/collections/${collection.slug}` }),
    );
  }

  if (!hasPermission(collection, "rater")) {
    return { error: "没有权限" };
  }

  await upsertOneReaction({
    reactorId: session.id,
    collectionItemId: collectionItem.id,
    attitude,
  });

  revalidatePath(`/collections/${collection.slug}`);

  return undefined;
};
