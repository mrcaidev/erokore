import { CollectionItemCard } from "@/components/collection-item-card";
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

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 py-4">
      {collectionItems.map((item) => (
        <li key={item.id}>
          <CollectionItemCard item={item} />
        </li>
      ))}
    </ul>
  );
};
