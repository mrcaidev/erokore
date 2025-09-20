import { and, eq } from "drizzle-orm";
import { db } from "@/database/client";
import { subscriptionsTable } from "@/database/schema";

export const insertOneSubscription = async (
  value: typeof subscriptionsTable.$inferInsert,
) => {
  const [subscription] = await db
    .insert(subscriptionsTable)
    .values(value)
    .onConflictDoNothing()
    .returning();
  return subscription;
};

export const deleteOneSubscriptionBySubscriberIdAndCollectionId = async (
  subscriberId: number,
  collectionId: number,
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
