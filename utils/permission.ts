import type {
  CollectionWithCollaborators,
  FullUser,
  PermissionLevel,
} from "./types";

const PERMISSION_LEVEL_WEIGHT: Record<PermissionLevel, number> = {
  none: 0,
  viewer: 1,
  rater: 2,
  contributor: 3,
  admin: 4,
  owner: 5,
};

export const comparePermissionLevels = (
  a: PermissionLevel,
  b: PermissionLevel,
) => {
  return PERMISSION_LEVEL_WEIGHT[a] - PERMISSION_LEVEL_WEIGHT[b];
};

export type HasPermissionOptions = {
  collection: CollectionWithCollaborators;
  user: Pick<FullUser, "id"> | undefined;
  permissionLevel: PermissionLevel;
};

export const hasPermission = ({
  collection,
  user,
  permissionLevel,
}: HasPermissionOptions) => {
  // 未登录
  if (!user) {
    return (
      comparePermissionLevels(
        collection.everyonePermissionLevel,
        permissionLevel,
      ) >= 0
    );
  }

  const collaboration = collection.collaborations.find(
    (c) => c.user.id === user.id,
  );

  // 非协作者
  if (!collaboration) {
    return (
      comparePermissionLevels(
        collection.everyonePermissionLevel,
        permissionLevel,
      ) >= 0
    );
  }

  // 默认权限等级的协作者
  if (collaboration.permissionLevel === "default") {
    return (
      comparePermissionLevels(
        collection.collaboratorPermissionLevel,
        permissionLevel,
      ) >= 0
    );
  }

  // 明确权限等级的协作者
  return (
    comparePermissionLevels(collaboration.permissionLevel, permissionLevel) >= 0
  );
};
