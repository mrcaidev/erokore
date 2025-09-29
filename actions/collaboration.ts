"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  deleteOneCollaborationById,
  selectOneCollaborationById,
  updateOneCollaborationById,
} from "@/database/collaboration";
import { selectOneCollectionWithMyPermissionLevelById } from "@/database/collection";
import {
  comparePermissionLevels,
  evaluatePermissionLevel,
  hasPermission,
} from "@/utils/permission";
import { getSession } from "@/utils/session";
import type { Collaboration, DefaultablePermissionLevel } from "@/utils/types";
import { buildRelativeUrl } from "@/utils/url";

export const alterPermissionLevel = async (
  collaborationId: Collaboration["id"],
  permissionLevel: DefaultablePermissionLevel,
) => {
  const collaboration = await selectOneCollaborationById(collaborationId);

  if (!collaboration) {
    return { error: "协作者不存在" };
  }

  const session = await getSession();

  const collection = await selectOneCollectionWithMyPermissionLevelById(
    collaboration.collectionId,
    session?.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!session) {
    return redirect(
      buildRelativeUrl("/sign-in", { next: `/collections/${collection.slug}` }),
    );
  }

  if (!hasPermission(collection, "admin")) {
    return { error: "没有权限" };
  }

  const myPermissionLevel = evaluatePermissionLevel(collection);
  const theirPermissionLevel =
    collaboration.permissionLevel === "default"
      ? collection.collaboratorPermissionLevel
      : collaboration.permissionLevel;

  if (comparePermissionLevels(myPermissionLevel, theirPermissionLevel) <= 0) {
    return { error: "没有权限" };
  }

  await updateOneCollaborationById(collaborationId, { permissionLevel });

  revalidatePath(`/collections/${collection.slug}/collaborators`);

  return undefined;
};

export const removeCollaboration = async (
  collaborationId: Collaboration["id"],
) => {
  const collaboration = await selectOneCollaborationById(collaborationId);

  if (!collaboration) {
    return { error: "协作者不存在" };
  }

  const session = await getSession();

  const collection = await selectOneCollectionWithMyPermissionLevelById(
    collaboration.collectionId,
    session?.id,
  );

  if (!collection) {
    return { error: "作品集不存在" };
  }

  if (!session) {
    return redirect(
      buildRelativeUrl("/sign-in", { next: `/collections/${collection.slug}` }),
    );
  }

  if (!hasPermission(collection, "admin")) {
    return { error: "没有权限" };
  }

  const myPermissionLevel = evaluatePermissionLevel(collection);
  const theirPermissionLevel =
    collaboration.permissionLevel === "default"
      ? collection.collaboratorPermissionLevel
      : collaboration.permissionLevel;

  if (comparePermissionLevels(myPermissionLevel, theirPermissionLevel) <= 0) {
    return { error: "没有权限" };
  }

  await deleteOneCollaborationById(collaborationId);

  revalidatePath(`/collections/${collection.slug}`);
  revalidatePath(`/collections/${collection.slug}/collaborators`);

  return undefined;
};
