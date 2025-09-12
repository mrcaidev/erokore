"use server";

import { redirect } from "next/navigation";
import {
  findOneCollectionBySlug,
  insertOneCollection,
} from "@/database/collection";
import { getCurrentUser } from "./user";

export const getCollectionBySlug = async (slug: string) => {
  const collection = await findOneCollectionBySlug(slug);
  return collection;
};

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

  const collection = await insertOneCollection({
    title,
    description,
    ownerId: owner.id,
  });

  if (!collection) {
    return { error: "创建失败，请稍后重试" };
  }

  return redirect(`/collections/${collection.slug}`);
};
