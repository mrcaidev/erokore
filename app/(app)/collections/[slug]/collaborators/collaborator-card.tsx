"use client";

import { debounce } from "lodash-es";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
  alterPermissionLevel,
  removeCollaboration,
} from "@/actions/collaboration";
import { PermissionLevelBadge } from "@/components/permission-level-badge";
import { PermissionLevelSelect } from "@/components/permission-level-select";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import {
  comparePermissionLevels,
  evaluatePermissionLevel,
  hasPermission,
  PERMISSION_LEVEL_LABEL_MAP,
} from "@/utils/permission";
import type {
  CollaboratorEnrichedCollaboration,
  DefaultablePermissionLevel,
  PersonalizedCollection,
} from "@/utils/types";

export type CollaboratorCardProps = {
  currentUserId: number;
  collection: PersonalizedCollection;
  collaboration: CollaboratorEnrichedCollaboration;
};

export const CollaboratorCard = ({
  currentUserId,
  collection,
  collaboration,
}: CollaboratorCardProps) => {
  const handleChange = async (value: DefaultablePermissionLevel) => {
    const res = await alterPermissionLevel(collaboration.id, value);
    if (res?.error) {
      toast.error(res.error);
    }
  };

  const handleClickDelete = async () => {
    const res = await removeCollaboration(collaboration.id);
    if (res?.error) {
      toast.error(res.error);
    }
  };

  const hisPermissionLevel =
    collaboration.permissionLevel === "default"
      ? collection.collaboratorPermissionLevel
      : collaboration.permissionLevel;
  const myPermissionLevel = evaluatePermissionLevel(collection);

  return (
    <div className="flex justify-between items-center gap-4 py-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={collaboration.collaborator} className="size-10" />
        <div>{collaboration.collaborator.nickname}</div>
      </div>
      {hasPermission(collection, "admin") ? (
        comparePermissionLevels(myPermissionLevel, hisPermissionLevel) <= 0 ? (
          <PermissionLevelBadge permissionLevel={hisPermissionLevel} />
        ) : (
          <div className="flex items-center gap-2">
            <PermissionLevelSelect
              options={[
                {
                  value: "default",
                  label: `跟随默认（${PERMISSION_LEVEL_LABEL_MAP[collection.collaboratorPermissionLevel]}）`,
                },
                { value: "viewer" },
                { value: "rater" },
                { value: "contributor" },
                { value: "admin" },
              ]}
              defaultValue={collaboration.permissionLevel}
              onValueChange={debounce(handleChange, 200)}
              disabled={collaboration.collaboratorId === currentUserId}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClickDelete}
              disabled={collaboration.collaboratorId === currentUserId}
              aria-label="移除协作者"
            >
              <TrashIcon className="text-destructive" />
            </Button>
          </div>
        )
      ) : (
        <PermissionLevelBadge
          permissionLevel={
            collaboration.permissionLevel === "default"
              ? collection.collaboratorPermissionLevel
              : collaboration.permissionLevel
          }
        />
      )}
    </div>
  );
};
