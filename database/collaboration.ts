import { db } from "./client";
import { collaborationsTable } from "./schema";

export const insertOneCollaboration = async (
  value: typeof collaborationsTable.$inferInsert,
) => {
  const [collaboration] = await db
    .insert(collaborationsTable)
    .values(value)
    .returning();
  return collaboration;
};
