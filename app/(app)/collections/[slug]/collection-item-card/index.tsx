import { ImageOffIcon } from "lucide-react";
import Image from "next/image";
import { UserAvatar } from "@/components/user-avatar";
import type { EnrichedCollectionItem } from "@/utils/types";
import { CollectionItemCardMenu } from "./menu";
import { SourceBadge } from "./source-badge";

export type CollectionItemCardProps = {
  item: EnrichedCollectionItem;
};

export const CollectionItemCard = ({ item }: CollectionItemCardProps) => {
  return (
    <div className="flex flex-col relative h-full border rounded-md overflow-hidden">
      {/* <a href={item.url} target="_blank" className="absolute inset-0">
        <span className="sr-only">前往链接</span>
      </a> */}
      <div className="aspect-video bg-muted overflow-hidden">
        {item.coverUrl ? (
          <Image src={item.coverUrl} alt="封面" width={1920} height={1080} />
        ) : (
          <div className="flex flex-col justify-center items-center gap-2 h-full text-muted-foreground text-sm">
            <ImageOffIcon />
            暂无预览图
          </div>
        )}
      </div>
      <div className="grow flex flex-col p-4">
        <h2 className="line-clamp-2 mb-2 font-medium">{item.title}</h2>
        <p className="grow line-clamp-3 mb-3 text-muted-foreground text-sm">
          {item.description || "暂无描述"}
        </p>
        <div className="flex justify-between items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <UserAvatar user={item.creator} hoverable className="size-7" />
            <div className="text-muted-foreground">
              添加于&nbsp;{item.createdAt.toLocaleDateString("zh")}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-2 left-2">
        <SourceBadge source={item.source} />
      </div>
      <div className="absolute top-2 right-2">
        <CollectionItemCardMenu item={item} />
      </div>
    </div>
  );
};
