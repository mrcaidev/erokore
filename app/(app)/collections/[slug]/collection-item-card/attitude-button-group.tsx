"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { showAttitudeTowardsCollectionItem } from "@/actions/reaction";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";
import type { Attitude, PersonalizedCollectionItem } from "@/utils/types";

export type AttitudeButtonGroupProps = {
  item: PersonalizedCollectionItem;
};

export const AttitudeButtonGroup = ({ item }: AttitudeButtonGroupProps) => {
  const attitude = item.myAttitude;

  const [optimisticAttitude, setOptimisticAttitude] = useOptimistic<
    Attitude | null,
    Attitude | null
  >(attitude, (_, newAttitude) => newAttitude);

  const handleClickLike = async () => {
    const newAttitude = attitude === "liked" ? null : "liked";

    startTransition(() => {
      setOptimisticAttitude(newAttitude);
    });

    const res = await showAttitudeTowardsCollectionItem(item.slug, newAttitude);
    if (res?.error) {
      toast.error(res.error);
    }
  };

  const handleClickDislike = async () => {
    const newAttitude = attitude === "disliked" ? null : "disliked";

    startTransition(() => {
      setOptimisticAttitude(newAttitude);
    });

    const res = await showAttitudeTowardsCollectionItem(item.slug, newAttitude);
    if (res?.error) {
      toast.error(res.error);
    }
  };

  return (
    <div className="flex items-center z-10">
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
