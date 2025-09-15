import { GlobeIcon, ImageIcon, VideoIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { SOURCE_LABEL_MAP } from "@/utils/source";
import type { Source } from "@/utils/types";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";

const SOURCE_BADGE_PROPS_MAP: Record<
  Source,
  ComponentProps<typeof Badge> & { icon?: ReactNode }
> = {
  custom: {
    icon: <GlobeIcon />,
    className: "bg-gray-300 text-black dark:bg-gray-700 dark:text-white",
  },
  missav: {
    icon: <VideoIcon />,
    className: "bg-fuchsia-500 dark:bg-fuchsia-600 text-white",
  },
  picacg: {
    icon: <ImageIcon />,
    className: "bg-pink-400 text-white",
  },
  ehentai: {
    icon: <ImageIcon />,
    className: "bg-emerald-500 dark:bg-emerald-600 text-white",
  },
  jmcomic: {
    icon: <ImageIcon />,
    className: "bg-orange-500 text-white",
  },
};

export type SourceBadgeProps = {
  source: Source;
};

export const SourceBadge = ({ source }: SourceBadgeProps) => {
  const { icon, className, ...props } = SOURCE_BADGE_PROPS_MAP[source];
  return (
    <Badge {...props} className={cn("gap-1", className)}>
      {icon}
      <span className="-translate-y-0.25">{SOURCE_LABEL_MAP[source]}</span>
    </Badge>
  );
};
