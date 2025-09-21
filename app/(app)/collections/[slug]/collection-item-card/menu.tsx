"use client";

import {
  EllipsisIcon,
  Loader2Icon,
  SquarePenIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { removeCollectionItem } from "@/actions/collection-item";
import { CollectionItemFormDialogContent } from "@/components/collection-item-form-dialog-content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PersonalizedCollectionItem } from "@/utils/types";

export type DeleteCollectionItemDialogContentProps = {
  item: PersonalizedCollectionItem;
  closeDialog: () => void;
};

const DeleteCollectionItemDialogContent = ({
  item,
  closeDialog,
}: DeleteCollectionItemDialogContentProps) => {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    const res = await removeCollectionItem(item.slug);
    if (res?.error) {
      toast.error(res.error);
    } else {
      closeDialog();
    }
    setPending(false);
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
  item: PersonalizedCollectionItem;
};

export const CollectionItemCardMenu = ({
  item,
}: CollectionItemCardMenuProps) => {
  const { slug } = useParams<{ slug: string }>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="opacity-50 hover:opacity-100"
          >
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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
        <CollectionItemFormDialogContent
          collectionSlug={slug}
          mode="edit"
          collectionItem={item}
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
