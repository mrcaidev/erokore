import type { InsertInvitation, Invitation } from "@/utils/types";
import { db } from "./client";
import { invitationsTable } from "./schema";

export const selectOneInviterEnrichedInvitationByCollectionIdAndCode = async (
  collectionId: Invitation["collectionId"],
  code: Invitation["code"],
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
    where: (invitationsTable, { and, eq }) =>
      and(
        eq(invitationsTable.collectionId, collectionId),
        eq(invitationsTable.code, code),
      ),
  });
  return invitation;
};

export const selectOneInvitationByCollectionIdAndCode = async (
  collectionId: Invitation["collectionId"],
  code: Invitation["code"],
) => {
  const invitation = await db.query.invitationsTable.findFirst({
    where: (invitationsTable, { and, eq }) =>
      and(
        eq(invitationsTable.collectionId, collectionId),
        eq(invitationsTable.code, code),
      ),
  });
  return invitation;
};

export const insertOneInvitation = async (value: InsertInvitation) => {
  const [invitation] = await db
    .insert(invitationsTable)
    .values(value)
    .returning();
  return invitation;
};
