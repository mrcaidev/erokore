"use client";

import { CheckIcon, Loader2Icon, PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionItemForm } from "@/forms/collection-item";
import type { PersonalizedCollection } from "@/utils/types";

export type AddCollectionItemDialogProps = {
  collection: PersonalizedCollection;
};

export const AddCollectionItemDialog = ({
  collection,
}: AddCollectionItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          添加作品
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加作品</DialogTitle>
          <DialogDescription>好东西就要一起分享！</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="manual">
          <TabsList className="w-full">
            <TabsTrigger value="auto">智能解析</TabsTrigger>
            <TabsTrigger value="manual">手动填充</TabsTrigger>
          </TabsList>
          <TabsContent value="auto">
            <div className="grid place-items-center h-80 text-muted-foreground">
              努力开发中……
            </div>
          </TabsContent>
          <TabsContent value="manual">
            <CollectionItemForm
              collectionId={collection.id}
              mode="create"
              beforeSubmit={() => {
                setPending(true);
              }}
              afterSubmit={() => {
                setPending(false);
                setOpen(false);
              }}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">
              <XIcon />
              取消
            </Button>
          </DialogClose>
          <Button type="submit" form="addCollectionItem" disabled={pending}>
            {pending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
            确定
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
