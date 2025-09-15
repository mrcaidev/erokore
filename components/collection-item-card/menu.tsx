"use client";

import {
  CheckIcon,
  EllipsisIcon,
  Loader2Icon,
  SquarePenIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useId, useState } from "react";
import { CollectionItemForm } from "@/forms/collection-item";
import { deleteCollectionItem } from "@/server/collection-item";
import type { EnrichedCollectionItem } from "@/utils/types";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type EditCollectionItemDialogContentProps = {
  item: EnrichedCollectionItem;
  closeDialog: () => void;
};

const EditCollectionItemDialogContent = ({
  item,
  closeDialog,
}: EditCollectionItemDialogContentProps) => {
  const formId = useId();
  const [pending, setPending] = useState(false);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>编辑作品</DialogTitle>
      </DialogHeader>
      <CollectionItemForm
        collectionId={item.collectionId}
        mode="edit"
        collectionItem={item}
        beforeSubmit={() => {
          setPending(true);
        }}
        afterSubmit={() => {
          setPending(false);
          closeDialog();
        }}
        id={formId}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">
            <XIcon />
            取消
          </Button>
        </DialogClose>
        <Button type="submit" form={formId} disabled={pending}>
          {pending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
          确定
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export type DeleteCollectionItemDialogContentProps = {
  item: EnrichedCollectionItem;
  closeDialog: () => void;
};

const DeleteCollectionItemDialogContent = ({
  item,
  closeDialog,
}: DeleteCollectionItemDialogContentProps) => {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    await deleteCollectionItem(item.id);
    setPending(false);
    closeDialog();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>删除作品</DialogTitle>
        <DialogDescription>
          确定要删除作品【{item.title}】吗？
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">
            <XIcon />
            取消
          </Button>
        </DialogClose>
        <Button variant="destructive" disabled={pending} onClick={handleClick}>
          {pending ? <Loader2Icon className="animate-spin" /> : <TrashIcon />}
          确定
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export type CollectionItemCardMenuProps = {
  item: EnrichedCollectionItem;
};

export const CollectionItemCardMenu = ({
  item,
}: CollectionItemCardMenuProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end">
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialogType("edit")}>
              <SquarePenIcon />
              编辑
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialogType("delete")}>
              <TrashIcon />
              删除
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogType === "edit" && (
        <EditCollectionItemDialogContent
          item={item}
          closeDialog={() => setDialogOpen(false)}
        />
      )}
      {dialogType === "delete" && (
        <DeleteCollectionItemDialogContent
          item={item}
          closeDialog={() => setDialogOpen(false)}
        />
      )}
    </Dialog>
  );
};
