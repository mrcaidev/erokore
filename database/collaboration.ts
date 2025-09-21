import { count, eq } from "drizzle-orm";
import type {
  Collaboration,
  InsertCollaboration,
  LimitOffsetOptions,
  UpdateCollaboration,
} from "@/utils/types";
import { db } from "./client";
import { collaborationsTable } from "./schema";

export const countCollaborationsByCollectionId = async (
  collectionId: Collaboration["collectionId"],
) => {
  const rows = await db
    .select({ count: count() })
    .from(collaborationsTable)
    .where(eq(collaborationsTable.collectionId, collectionId));
  return rows[0]?.count ?? 0;
};

export const selectManyCollaboratorEnrichedCollaborationsByCollectionId =
  async (
    collectionId: Collaboration["collectionId"],
    options: LimitOffsetOptions = {},
  ) => {
    const collaborations = await db.query.collaborationsTable.findMany({
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
      limit: options.limit,
      offset: options.offset,
    });
    return collaborations;
  };

export const selectOneCollaborationById = async (id: Collaboration["id"]) => {
  const collaboration = await db.query.collaborationsTable.findFirst({
    where: (collaborationsTable, { eq }) => eq(collaborationsTable.id, id),
  });
  return collaboration;
};

export const insertOneCollaboration = async (value: InsertCollaboration) => {
  const [collaboration] = await db
    .insert(collaborationsTable)
    .values(value)
    .returning();
  return collaboration;
};

export const updateOneCollaborationById = async (
  id: Collaboration["id"],
  value: UpdateCollaboration,
) => {
  await db
    .update(collaborationsTable)
    .set(value)
    .where(eq(collaborationsTable.id, id));
};

export const deleteOneCollaborationById = async (id: Collaboration["id"]) => {
  await db.delete(collaborationsTable).where(eq(collaborationsTable.id, id));
};
