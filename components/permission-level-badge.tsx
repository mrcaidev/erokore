import type { PermissionLevel } from "@/database/types";
import { PERMISSION_LEVEL_LABEL_MAP } from "@/utils/permission";
import { Badge } from "./ui/badge";

export type PermissionLevelBadgeProps = {
  permissionLevel: PermissionLevel;
};

export const PermissionLevelBadge = ({
  permissionLevel,
}: PermissionLevelBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={
        permissionLevel === "owner"
          ? "bg-orange-500/50"
          : permissionLevel === "admin"
            ? "bg-emerald-500/50"
            : permissionLevel === "contributor"
              ? "bg-purple-500/50"
              : permissionLevel === "rater"
                ? "bg-blue-500/50"
                : ""
      }
    >
      {PERMISSION_LEVEL_LABEL_MAP[permissionLevel]}
    </Badge>
  );
};
