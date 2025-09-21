"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { selectOneCollectionWithMyPermissionLevelBySlug } from "@/database/collection";
import {
  deleteOneSubscriptionBySubscriberIdAndCollectionId,
  insertOneSubscription,
} from "@/database/subscription";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import type { Collection } from "@/utils/types";

export const subscribeToCollection = async (
  collectionSlug: Collection["slug"],
) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collectionSlug}`)}`,
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    collectionSlug,
    session.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!hasPermission(collection, "viewer")) {
    return { error: "没有权限" };
  }

  await insertOneSubscription({
    subscriberId: session.id,
    collectionId: collection.id,
  });

  revalidatePath(`/collections/${collectionSlug}`);

  return undefined;
};

export const unsubscribeFromCollection = async (
  collectionSlug: Collection["slug"],
) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collectionSlug}`)}`,
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    collectionSlug,
    session.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!hasPermission(collection, "viewer")) {
    return { error: "没有权限" };
  }

  await deleteOneSubscriptionBySubscriberIdAndCollectionId(
    session.id,
    collection.id,
  );

  revalidatePath(`/collections/${collectionSlug}`);

  return undefined;
};
