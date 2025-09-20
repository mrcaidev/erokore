"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import type { Attitude, FullCollectionItem } from "@/database/types";
import { reactToCollectionItem } from "@/server/reaction";

export type AttitudeButtonGroupProps = {
  item: FullCollectionItem;
};

export const AttitudeButtonGroup = ({ item }: AttitudeButtonGroupProps) => {
  const attitude = item.my.attitude;

  const [optimisticAttitude, setOptimisticAttitude] = useOptimistic<
    Attitude | null,
    Attitude | null
  >(attitude, (_, newAttitude) => newAttitude);

  const handleClickLike = async () => {
    const newAttitude = attitude === "liked" ? null : "liked";

    startTransition(() => {
      setOptimisticAttitude(newAttitude);
    });

    await reactToCollectionItem({
      collectionItemId: item.id,
      attitude: newAttitude,
    });
  };

  const handleClickDislike = async () => {
    const newAttitude = attitude === "disliked" ? null : "disliked";

    startTransition(() => {
      setOptimisticAttitude(newAttitude);
    });

    await reactToCollectionItem({
      collectionItemId: item.id,
      attitude: newAttitude,
    });
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClickLike}
        aria-label={attitude === "liked" ? "取消点赞" : "点赞"}
        className="text-muted-foreground hover:text-foreground"
      >
        <ThumbsUpIcon
          className={cn(optimisticAttitude === "liked" && "fill-current")}
        />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClickDislike}
        aria-label={attitude === "disliked" ? "取消点踩" : "点踩"}
        className="text-muted-foreground hover:text-foreground"
      >
        <ThumbsDownIcon
          className={cn(optimisticAttitude === "disliked" && "fill-current")}
        />
      </Button>
    </div>
  );
};
