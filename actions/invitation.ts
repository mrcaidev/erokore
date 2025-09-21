"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { insertOneCollaboration } from "@/database/collaboration";
import { selectOneCollectionWithMyPermissionLevelBySlug } from "@/database/collection";
import {
  insertOneInvitation,
  selectOneInvitationByCollectionIdAndCode,
} from "@/database/invitation";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import type { Collection, InsertInvitation, Invitation } from "@/utils/types";

export type GenerateInvitationReq = {
  collectionSlug: Collection["slug"];
} & Pick<InsertInvitation, "permissionLevel" | "expiresAt">;

export const generateInvitation = async (req: GenerateInvitationReq) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${req.collectionSlug}/collaborators`)}`,
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    req.collectionSlug,
    session.id,
  );

  if (!collection) {
    return { ok: false, error: "作品集不存在" } as const;
  }

  if (!hasPermission(collection, "admin")) {
    return { ok: false, error: "没有权限" } as const;
  }

  const invitation = await insertOneInvitation({
    inviterId: session.id,
    collectionId: collection.id,
    permissionLevel: req.permissionLevel,
    expiresAt: req.expiresAt,
  });

  if (!invitation) {
    return { ok: false, error: "生成邀请失败，请稍后再试" } as const;
  }

  return { ok: true, invitation } as const;
};

export type AcceptInvitationReq = {
  collectionSlug: Collection["slug"];
  code: Invitation["code"];
};

export const acceptInvitation = async (req: AcceptInvitationReq) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${req.collectionSlug}/invite?code=${req.code}`)}`,
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    req.collectionSlug,
    session.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (collection.myPermissionLevel !== null) {
    return redirect(`/collections/${req.collectionSlug}`);
  }

  const invitation = await selectOneInvitationByCollectionIdAndCode(
    collection.id,
    req.code,
  );

  if (!invitation) {
    return { error: "邀请码错误" };
  }

  if (Date.now() >= invitation.expiresAt.getTime()) {
    return { error: "邀请已过期" };
  }

  await insertOneCollaboration({
    collaboratorId: session.id,
    collectionId: collection.id,
    permissionLevel: invitation.permissionLevel,
  });

  revalidatePath(`/collections/${req.collectionSlug}`);
  revalidatePath(`/collections/${req.collectionSlug}/collaborators`);
  revalidatePath(`/collections/${req.collectionSlug}/invite`);

  return redirect(`/collections/${req.collectionSlug}`);
};
