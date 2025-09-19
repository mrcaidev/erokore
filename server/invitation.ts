"use server";

import { notFound, redirect } from "next/navigation";
import { insertOneCollaboration } from "@/database/collaboration";
import {
  selectOnePersonalizedCollectionById,
  selectOnePersonalizedCollectionBySlug,
} from "@/database/collection";
import {
  insertOneInvitation,
  selectOneEnrichedInvitationByCollectionIdAndCode,
} from "@/database/invitation";
import { hasPermission } from "@/utils/permission";
import { getSession } from "@/utils/session";
import type { DefaultablePermissionLevel } from "@/utils/types";

export type VerifyInvitationRequest = {
  collectionSlug: string;
  invitationCode: string;
};

export const verifyInvitation = async ({
  collectionSlug,
  invitationCode,
}: VerifyInvitationRequest) => {
  const session = await getSession();

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collectionSlug}/collaborators/invite?code=${invitationCode}`)}`,
    );
  }

  const collection = await selectOnePersonalizedCollectionBySlug(
    collectionSlug,
    session.id,
  );

  if (!collection) {
    return notFound();
  }

  if (collection.my.permissionLevel !== null) {
    return redirect(`/collections/${collectionSlug}`);
  }

  const invitation = await selectOneEnrichedInvitationByCollectionIdAndCode(
    collection.id,
    invitationCode,
  );

  if (!invitation) {
    return notFound();
  }

  return { invitation, collection };
};

export type GenerateInvitationRequest = {
  collectionId: number;
  permissionLevel: DefaultablePermissionLevel;
  expiresAt: Date;
};

export const generateInvitation = async (req: GenerateInvitationRequest) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    session?.id,
  );

  if (!collection) {
    return { ok: false, error: "作品集可能被删掉了" } as const;
  }

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}/collaborators`)}`,
    );
  }

  if (!hasPermission(collection, "admin")) {
    return { ok: false, error: "没有权限邀请" } as const;
  }

  const invitation = await insertOneInvitation({
    inviterId: session.id,
    collectionId: req.collectionId,
    permissionLevel: req.permissionLevel,
    expiresAt: req.expiresAt,
  });

  if (!invitation) {
    return { ok: false, error: "生成邀请失败，请稍后再试" } as const;
  }

  return { ok: true, invitation } as const;
};

export type AcceptInvitationRequest = {
  collectionSlug: string;
  code: string;
};

export const acceptInvitation = async (req: AcceptInvitationRequest) => {
  const session = await getSession();

  const collection = await selectOnePersonalizedCollectionBySlug(
    req.collectionSlug,
    session?.id,
  );

  if (!collection) {
    return { ok: false, error: "作品集可能被删掉了" };
  }

  if (!session) {
    return redirect(
      `/sign-in?next=${encodeURIComponent(`/collections/${collection.slug}/collaborators/invite?code=${req.code}`)}`,
    );
  }

  if (collection.my.permissionLevel !== null) {
    return redirect(`/collections/${collection.slug}`);
  }

  const invitation = await selectOneEnrichedInvitationByCollectionIdAndCode(
    collection.id,
    req.code,
  );

  if (!invitation) {
    return { ok: false, error: "邀请不存在" };
  }

  if (Date.now() >= invitation.expiresAt.getTime()) {
    return { ok: false, error: "邀请已过期" };
  }

  await insertOneCollaboration({
    collectionId: collection.id,
    collaboratorId: session.id,
    permissionLevel: invitation.permissionLevel,
  });

  return redirect(`/collections/${collection.slug}`);
};
