import type { Collection } from "@/utils/types";
import { db } from "./client";

const collectionsCollection = db.collection<Collection>("collections");

export const findOneCollectionById = async (id: string) => {
  const collection = await collectionsCollection.findOne(
    { id, deletedAt: null },
    { projection: { _id: 0 } },
  );
  return collection;
};

export const insertOneCollection = async (collection: Collection) => {
  const result = await collectionsCollection.insertOne(collection);
  return result;
};
