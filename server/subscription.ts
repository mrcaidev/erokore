"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import { selectOnePersonalizedCollectionById } from "@/repository/collection";
import {
  deleteOneSubscriptionBySubscriberIdAndCollectionId,
  insertOneSubscription,
} from "@/repository/subscription";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";

export const subscribeToCollection = async (id: number) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionById(id, session?.id);

  if (!collection) {
    return notFound();
  }

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}`)}`,
    );
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  await insertOneSubscription({ subscriberId: session.id, collectionId: id });

  revalidatePath(`/collections/${collection.slug}`);
};

export const unsubscribeFromCollection = async (id: number) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionById(id, session?.id);

  if (!collection) {
    return notFound();
  }

  if (!session) {
    return redirect(`/collections/${collection.slug}`);
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  await deleteOneSubscriptionBySubscriberIdAndCollectionId(session.id, id);

  revalidatePath(`/collections/${collection.slug}`);
};
