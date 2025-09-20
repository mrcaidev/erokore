import type { PermissionLevel, PersonalizedCollection } from "@/database/types";
import { listPersonalizedCollectionItemsByCollectionId } from "@/server/collection-item";
import { CollectionItemCard } from "./collection-item-card";

export type CollectionItemList = {
  collection: PersonalizedCollection;
  permissionLevel: PermissionLevel;
};

export const CollectionItemList = async ({
  collection,
  permissionLevel,
}: CollectionItemList) => {
  const collectionItems = await listPersonalizedCollectionItemsByCollectionId(
    collection.id,
  );

  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 py-4">
      {collectionItems.map((item) => (
        <li key={item.id}>
          <CollectionItemCard item={item} permissionLevel={permissionLevel} />
        </li>
      ))}
    </ul>
  );
};
