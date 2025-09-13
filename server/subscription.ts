"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound, redirect } from "next/navigation";
import { selectOnePersonalizedCollectionById } from "@/database/collection";
import {
  deleteOneSubscriptionByUserIdAndCollectionId,
  insertOneSubscription,
} from "@/database/subscription";
import { hasPermission } from "@/utils/permission";
import { findCurrentUser } from "./auth";

export const subscribeToCollection = async (id: number) => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const collection = await selectOnePersonalizedCollectionById(id, user.id);

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  await insertOneSubscription({ userId: user.id, collectionId: id });

  revalidatePath(`/collections/${collection.slug}`);
};

export const unsubscribeFromCollection = async (id: number) => {
  const user = await findCurrentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const collection = await selectOnePersonalizedCollectionById(id, user.id);

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  await deleteOneSubscriptionByUserIdAndCollectionId(user.id, id);

  revalidatePath(`/collections/${collection.slug}`);
};
