import type { InsertReaction } from "@/utils/types";
import { db } from "./client";
import { reactionsTable } from "./schema";

export const upsertOneReaction = async (value: InsertReaction) => {
  await db
    .insert(reactionsTable)
    .values(value)
    .onConflictDoUpdate({
      target: [reactionsTable.reactorId, reactionsTable.collectionItemId],
      set: value,
    });
};
