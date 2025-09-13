"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { PersonalizedCollection } from "@/utils/types";

export type CopyShareLinkButtonProps = {
  collection: PersonalizedCollection;
};

export const CopyShareLinkButton = ({
  collection,
}: CopyShareLinkButtonProps) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(
        `我分享了一个 Erokore 的作品集【${collection.title}】：${window.location.href}`,
      );
      toast.success("复制成功");
    } catch {
      toast.error("复制失败，但可以手动复制浏览器地址栏当前的网址");
    }
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      <CopyIcon />
      复制分享链接
    </DropdownMenuItem>
  );
};
