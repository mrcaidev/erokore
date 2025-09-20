import { EllipsisVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PersonalizedCollection } from "@/database/types";
import { hasPermission } from "@/utils/permission";
import { AddCollectionItemDialog } from "./add-collection-item-dialog";
import { CopyShareLinkButton } from "./copy-share-link-button";
import { DeleteCollectionDialogContent } from "./delete-collection-dialog-content";
import { DeleteCollectionDialogTrigger } from "./delete-collection-dialog-trigger";
import { EditCollectionLink } from "./edit-collection-link";
import { SubscribeButton } from "./subscribe-button";

export type OperationsProps = {
  collection: PersonalizedCollection;
};

export const Operations = ({ collection }: OperationsProps) => {
  const isContributor = hasPermission(collection, "contributor");
  const isAdmin = hasPermission(collection, "admin");
  const isOwner = hasPermission(collection, "owner");

  return (
    <div className="flex items-center gap-2">
      <SubscribeButton collection={collection} />
      {isContributor && <AddCollectionItemDialog collection={collection} />}
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="更多操作">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <CopyShareLinkButton collection={collection} />
            {isAdmin && <EditCollectionLink collection={collection} />}
            {isOwner && <DeleteCollectionDialogTrigger />}
          </DropdownMenuContent>
        </DropdownMenu>
        {isOwner && <DeleteCollectionDialogContent collection={collection} />}
      </Dialog>
    </div>
  );
};
