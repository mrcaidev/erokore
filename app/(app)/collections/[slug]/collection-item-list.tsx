import { listEnrichedCollectionItemsByCollectionId } from "@/server/collection-item";
import type { PersonalizedCollection } from "@/utils/types";

export type CollectionItemList = {
  collection: PersonalizedCollection;
};

export const CollectionItemList = async ({
  collection,
}: CollectionItemList) => {
  const collectionItems = await listEnrichedCollectionItemsByCollectionId(
    collection.id,
  );

  return <div>{JSON.stringify(collectionItems)}</div>;
};
