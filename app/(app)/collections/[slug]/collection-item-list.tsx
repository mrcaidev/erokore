import type {
  PermissionLevel,
  PersonalizedCollectionItem,
} from "@/utils/types";
import { CollectionItemCard } from "./collection-item-card";

export type CollectionItemList = {
  collectionItems: PersonalizedCollectionItem[];
  permissionLevel: PermissionLevel;
};

export const CollectionItemList = async ({
  collectionItems,
  permissionLevel,
}: CollectionItemList) => {
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
