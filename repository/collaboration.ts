import { eq } from "drizzle-orm";
import { db } from "@/database/client";
import { collaborationsTable } from "@/database/schema";

export const selectManyEnrichedCollaborationsByCollectionId = async (
  collectionId: number,
) => {
  const collaborators = await db.query.collaborationsTable.findMany({
    with: {
      collaborator: {
        columns: {
          id: true,
          slug: true,
          email: true,
          nickname: true,
          avatarUrl: true,
        },
      },
    },
    where: (collaborationsTable, { eq }) =>
      eq(collaborationsTable.collectionId, collectionId),
    orderBy: (collaborationsTable, { asc }) => [
      asc(collaborationsTable.createdAt),
    ],
  });
  return collaborators;
};

export const selectOneCollaborationById = async (id: number) => {
  const collaboration = await db.query.collaborationsTable.findFirst({
    where: (collaborationsTable, { eq }) => eq(collaborationsTable.id, id),
  });
  return collaboration;
};

export const insertOneCollaboration = async (
  value: typeof collaborationsTable.$inferInsert,
) => {
  const [collaboration] = await db
    .insert(collaborationsTable)
    .values(value)
    .returning();
  return collaboration;
};

export const updateOneCollaborationById = async (
  id: number,
  value: Partial<typeof collaborationsTable.$inferInsert>,
) => {
  const [collaboration] = await db
    .update(collaborationsTable)
    .set(value)
    .where(eq(collaborationsTable.id, id))
    .returning();
  return collaboration;
};

export const deleteOneCollaborationById = async (id: number) => {
  await db.delete(collaborationsTable).where(eq(collaborationsTable.id, id));
};
