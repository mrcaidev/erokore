import { and } from "drizzle-orm";
import { db } from "./client";
import { invitationsTable } from "./schema";

export const selectOneEnrichedInvitationByCollectionIdAndCode = async (
  collectionId: number,
  code: string,
) => {
  const invitation = await db.query.invitationsTable.findFirst({
    with: {
      inviter: {
        columns: {
          id: true,
          slug: true,
          email: true,
          nickname: true,
          avatarUrl: true,
        },
      },
    },
    where: (invitationsTable, { eq }) =>
      and(
        eq(invitationsTable.collectionId, collectionId),
        eq(invitationsTable.code, code),
      ),
  });
  return invitation;
};

export const insertOneInvitation = async (
  value: typeof invitationsTable.$inferInsert,
) => {
  const [invitation] = await db
    .insert(invitationsTable)
    .values(value)
    .returning();
  return invitation;
};
