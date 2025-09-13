import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PersonalizedCollection } from "@/utils/types";

export type AddCollectionItemDialogProps = {
  collection: PersonalizedCollection;
};

export const AddCollectionItemDialog = ({
  collection,
}: AddCollectionItemDialogProps) => {
  return (
    <Button>
      <PlusIcon />
      添加作品
    </Button>
  );
};
