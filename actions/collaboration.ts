"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import type { DefaultablePermissionLevel } from "@/database/types";
import {
  deleteOneCollaborationById,
  selectOneCollaborationById,
  updateOneCollaborationById,
} from "@/repository/collaboration";
import { selectOnePersonalizedCollectionById } from "@/repository/collection";
import {
  comparePermissionLevels,
  evaluatePermissionLevel,
  hasPermission,
} from "@/utils/permission";
import { getSession } from "@/utils/session";

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

  const session = await getSession();
  const collection = await selectOnePersonalizedCollectionById(
    collaboration.collectionId,
    session?.id,
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

  return undefined;
};

export const removeCollaboration = async (collaborationId: number) => {
  const collaboration = await selectOneCollaborationById(collaborationId);

  if (!collaboration) {
    return { error: "该协作者已被删除" };
  }

  const session = await getSession();
  const collection = await selectOnePersonalizedCollectionById(
    collaboration.collectionId,
    session?.id,
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
