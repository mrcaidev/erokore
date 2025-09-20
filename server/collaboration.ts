"use server";

import { revalidatePath } from "next/cache";
import { forbidden, notFound } from "next/navigation";
import {
  deleteOneCollaborationById,
  selectManyEnrichedCollaborationsByCollectionId,
  selectOneCollaborationById,
  updateOneCollaborationById,
} from "@/database/collaboration";
import { selectOnePersonalizedCollectionById } from "@/database/collection";
import type { DefaultablePermissionLevel } from "@/database/types";
import {
  comparePermissionLevels,
  evaluatePermissionLevel,
  hasPermission,
} from "@/utils/permission";
import { findCurrentUser } from "./auth";

export const listEnrichedCollaborations = async (collectionId: number) => {
  const user = await findCurrentUser();

  const collection = await selectOnePersonalizedCollectionById(
    collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "viewer")) {
    return forbidden();
  }

  const collaborations =
    await selectManyEnrichedCollaborationsByCollectionId(collectionId);
  return collaborations;
};

export type AlterPermissionLevelRequest = {
  collaborationId: number;
  permissionLevel: DefaultablePermissionLevel;
};

export const alterPermissionLevel = async (
  req: AlterPermissionLevelRequest,
) => {
  const collaboration = await selectOneCollaborationById(req.collaborationId);

  if (!collaboration) {
    return { error: "该协作者已被移除" };
  }

  const user = await findCurrentUser();
  const collection = await selectOnePersonalizedCollectionById(
    collaboration.collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "admin")) {
    return { error: "没有权限更改" };
  }

  await updateOneCollaborationById(req.collaborationId, {
    permissionLevel: req.permissionLevel,
  });

  revalidatePath(`/collections/${collection.slug}/collaborators`);
};

export const removeCollaboration = async (collaborationId: number) => {
  const collaboration = await selectOneCollaborationById(collaborationId);

  if (!collaboration) {
    return { error: "该协作者已被删除" };
  }

  const user = await findCurrentUser();
  const collection = await selectOnePersonalizedCollectionById(
    collaboration.collectionId,
    user?.id,
  );

  if (!collection) {
    return notFound();
  }

  if (!hasPermission(collection, "admin")) {
    return { error: "没有权限移除" };
  }

  const myPermissionLevel = evaluatePermissionLevel(collection);
  const targetPermissionLevel =
    collaboration.permissionLevel === "default"
      ? collection.collaboratorPermissionLevel
      : collaboration.permissionLevel;

  if (comparePermissionLevels(myPermissionLevel, targetPermissionLevel) <= 0) {
    return { error: "没有权限移除" };
  }

  await deleteOneCollaborationById(collaboration.id);

  revalidatePath(`/collections/${collection.slug}/collaborators`);

  return undefined;
};
