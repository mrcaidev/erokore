import { SquarePenIcon } from "lucide-react";
import Link from "next/link";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { PersonalizedCollection } from "@/database/types";

export type EditCollectionLinkProps = {
  collection: PersonalizedCollection;
};

export const EditCollectionLink = ({ collection }: EditCollectionLinkProps) => {
  return (
    <Link href={`/collections/${collection.slug}/edit`}>
      <DropdownMenuItem>
        <SquarePenIcon />
        编辑
      </DropdownMenuItem>
    </Link>
  );
};
