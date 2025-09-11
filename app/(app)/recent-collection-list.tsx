"use client";

import { ChevronUpIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/components/ui/utils";

export const RecentCollectionCard = () => {
  return (
    <Link
      href="#"
      className="flex items-center gap-2 p-3 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
    >
      <FolderIcon className="size-4" />
      <div className="max-w-56 text-sm truncate">作品集名称</div>
    </Link>
  );
};

export const RecentCollectionList = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 w-full py-3 border-b cursor-pointer"
      >
        <ChevronUpIcon
          className={cn(
            "size-4 transition-transform",
            expanded && "rotate-180",
          )}
        />
        <div className="font-medium text-sm">最近浏览</div>
      </button>
      {expanded && (
        <ul className="divide-y-1">
          <li>
            <RecentCollectionCard />
          </li>
          <li>
            <RecentCollectionCard />
          </li>
          <li>
            <RecentCollectionCard />
          </li>
        </ul>
      )}
    </div>
  );
};
