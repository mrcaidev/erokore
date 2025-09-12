"use server";

import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { insertOneCollection } from "@/database/collection";
import { type Collection, PermissionLevel } from "@/utils/types";
import { getCurrentUser } from "./user";

type CreateCollectionRequest = {
  title: string;
  description: string;
};

export const createCollection = async ({
  title,
  description,
}: CreateCollectionRequest) => {
  const owner = await getCurrentUser();

  if (!owner) {
    return redirect("/sign-in");
  }

  const collection: Collection = {
    id: nanoid(8),
    title,
    description,
    owner: {
      id: owner.id,
      email: owner.email,
      nickname: owner.nickname,
      avatarUrl: owner.avatarUrl,
    },
    collaborators: [],
    collaboratorDefaultPermissionLevel: PermissionLevel.Contribute,
    everyonePermissionLevel: PermissionLevel.None,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  await insertOneCollection(collection);

  return redirect(`/collections/${collection.id}`);
};
