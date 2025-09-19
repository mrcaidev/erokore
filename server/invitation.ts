"use server";

import { forbidden, notFound, redirect } from "next/navigation";
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
    return redirect("/sign-in");
  }

  const collection = await selectOnePersonalizedCollectionBySlug(
    collectionSlug,
    session.id,
  );

  if (!collection) {
    return notFound();
  }

  if (collection.my.permissionLevel !== null) {
    return forbidden();
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

  if (!session) {
    return redirect("/sign-in");
  }

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    session.id,
  );

  if (!collection) {
    return { ok: false, error: "作品集可能被删掉了" } as const;
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
  collectionId: number;
  code: string;
};

export const acceptInvitation = async (req: AcceptInvitationRequest) => {
  const session = await getSession();

  if (!session) {
    return redirect("/sign-in");
  }

  const collection = await selectOnePersonalizedCollectionById(
    req.collectionId,
    session.id,
  );

  if (!collection) {
    return { ok: false, error: "作品集可能被删掉了" };
  }

  if (collection.my.permissionLevel !== null) {
    return { ok: false, error: "你已经是协作者啦" };
  }

  const invitation = await selectOneEnrichedInvitationByCollectionIdAndCode(
    req.collectionId,
    req.code,
  );

  if (!invitation) {
    return { ok: false, error: "邀请不存在" };
  }

  if (Date.now() >= invitation.expiresAt.getTime()) {
    return { ok: false, error: "邀请已过期" };
  }

  await insertOneCollaboration({
    collectionId: req.collectionId,
    collaboratorId: session.id,
    permissionLevel: invitation.permissionLevel,
  });

  return redirect(`/collections/${collection.slug}`);
};
