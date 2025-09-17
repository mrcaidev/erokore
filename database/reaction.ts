import { db } from "./client";
import { reactionsTable } from "./schema";

export const upsertOneReaction = async (
  value: typeof reactionsTable.$inferInsert,
) => {
  const [reaction] = await db
    .insert(reactionsTable)
    .values(value)
    .onConflictDoUpdate({
      target: [reactionsTable.reactorId, reactionsTable.collectionItemId],
      set: value,
    })
    .returning();
  return reaction;
};
