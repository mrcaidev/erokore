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
import { buildAuthUrl } from "@/utils/url";

export const generateInvitation = async (
  collectionSlug: Collection["slug"],
  value: Pick<InsertInvitation, "permissionLevel" | "expiresAt">,
) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      buildAuthUrl("/sign-in", `/collections/${collectionSlug}/collaborators`),
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    collectionSlug,
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
    ...value,
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

export const acceptInvitation = async (
  collectionSlug: Collection["slug"],
  code: Invitation["code"],
) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      buildAuthUrl(
        "/sign-in",
        `/collections/${collectionSlug}/invite?code=${code}`,
      ),
    );
  }

  const collection = await selectOneCollectionWithMyPermissionLevelBySlug(
    collectionSlug,
    session.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (collection.myPermissionLevel !== null) {
    return redirect(`/collections/${collectionSlug}`);
  }

  const invitation = await selectOneInvitationByCollectionIdAndCode(
    collection.id,
    code,
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

  revalidatePath(`/collections/${collectionSlug}`);
  revalidatePath(`/collections/${collectionSlug}/collaborators`);
  revalidatePath(`/collections/${collectionSlug}/invite`);

  return redirect(`/collections/${collectionSlug}`);
};
