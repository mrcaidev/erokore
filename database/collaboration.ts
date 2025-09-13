import { db } from "./client";
import { collaborationsTable } from "./schema";

export const listCollaborationsByCollectionId = async (
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

export const insertOneCollaboration = async (
  value: typeof collaborationsTable.$inferInsert,
) => {
  const [collaboration] = await db
    .insert(collaborationsTable)
    .values(value)
    .returning();
  return collaboration;
};
