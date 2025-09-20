import { GlobeIcon, ImageIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";
import { sourceConfigs } from "@/sources";

export type SourceBadgeProps = {
  source: string;
};

export const SourceBadge = ({ source }: SourceBadgeProps) => {
  const sourceConfig = sourceConfigs.find((s) => s.source === source);

  return (
    <Badge
      className={cn(
        "gap-1",
        sourceConfig?.badge?.className ??
          "bg-gray-300 text-black dark:bg-gray-700 dark:text-white",
      )}
    >
      {sourceConfig?.badge?.icon === "image" ? (
        <ImageIcon />
      ) : sourceConfig?.badge?.icon === "video" ? (
        <VideoIcon />
      ) : (
        <GlobeIcon />
      )}
      <span className="-translate-y-0.25">
        {sourceConfig?.name ?? sourceConfig?.source}
      </span>
    </Badge>
  );
};
