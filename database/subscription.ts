import { and, count, eq } from "drizzle-orm";
import type {
  InsertSubscription,
  LimitOffsetOptions,
  Subscription,
} from "@/utils/types";
import { db } from "./client";
import { subscriptionsTable } from "./schema";

export const countSubscriptionsBySubscriberId = async (
  subscriberId: Subscription["subscriberId"],
) => {
  const rows = await db
    .select({ count: count() })
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.subscriberId, subscriberId));
  return rows[0]?.count ?? 0;
};

export const selectManyCollectionEnrichedSubscriptionsBySubscriberId = async (
  subscriberId: Subscription["subscriberId"],
  options: LimitOffsetOptions = {},
) => {
  const subscriptions = await db.query.subscriptionsTable.findMany({
    with: {
      collection: true,
    },
    where: eq(subscriptionsTable.subscriberId, subscriberId),
    orderBy: (subscriptionsTable, { desc }) => [
      desc(subscriptionsTable.createdAt),
    ],
    limit: options.limit,
    offset: options.offset,
  });
  return subscriptions;
};

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
