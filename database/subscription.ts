import { and, eq } from "drizzle-orm";
import type { InsertSubscription, Subscription } from "@/utils/types";
import { db } from "./client";
import { subscriptionsTable } from "./schema";

export const insertOneSubscription = async (value: InsertSubscription) => {
  const [subscription] = await db
    .insert(subscriptionsTable)
    .values(value)
    .onConflictDoNothing()
    .returning();
  return subscription;
};

export const deleteOneSubscriptionBySubscriberIdAndCollectionId = async (
  subscriberId: Subscription["subscriberId"],
  collectionId: Subscription["collectionId"],
) => {
  await db
    .delete(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.subscriberId, subscriberId),
        eq(subscriptionsTable.collectionId, collectionId),
      ),
    );
};
