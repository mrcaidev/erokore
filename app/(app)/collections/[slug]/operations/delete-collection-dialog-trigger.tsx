import { TrashIcon } from "lucide-react";
import { DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const DeleteCollectionDialogTrigger = () => {
  return (
    <DialogTrigger asChild>
      <DropdownMenuItem>
        <TrashIcon />
        删除
      </DropdownMenuItem>
    </DialogTrigger>
  );
};
