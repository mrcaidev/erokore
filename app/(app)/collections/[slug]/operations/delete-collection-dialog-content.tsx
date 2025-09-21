"use client";

import { Loader2Icon, TrashIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { removeCollection } from "@/actions/collection";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PersonalizedCollection } from "@/utils/types";

export type DeleteCollectionDialogContentProps = {
  collection: PersonalizedCollection;
};

export const DeleteCollectionDialogContent = ({
  collection,
}: DeleteCollectionDialogContentProps) => {
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    setPending(true);
    const res = await removeCollection(collection.slug);
    if (res.error) {
      toast.error(res.error);
    }
    setPending(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>删除作品集</DialogTitle>
        <DialogDescription>
          确定要删除作品集【{collection.title}
          】吗？其中的作品将永远丢失，其他用户也无法再访问该作品集。
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
