"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { CollectionItemFormDialogContent } from "@/components/collection-item-form-dialog-content";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import type { FullCollection } from "@/database/types";

export type AddCollectionItemDialogProps = {
  collection: FullCollection;
};

export const AddCollectionItemDialog = ({
  collection,
}: AddCollectionItemDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          添加作品
        </Button>
      </DialogTrigger>
      <CollectionItemFormDialogContent
        collectionId={collection.id}
        mode="create"
        closeDialog={() => {
          setOpen(false);
        }}
      />
    </Dialog>
  );
};
