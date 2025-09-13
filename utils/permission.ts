import type { PermissionLevel, PersonalizedCollection } from "./types";

export const PERMISSION_LEVEL_LABEL_MAP: Record<PermissionLevel, string> = {
  none: "不可见",
  viewer: "可查看",
  rater: "可评价",
  contributor: "可贡献",
  admin: "可管理",
  owner: "创建者",
};

export const PERMISSION_LEVEL_WEIGHT: Record<PermissionLevel, number> = {
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

export const hasPermission = (
  collection: PersonalizedCollection,
  permissionLevel: PermissionLevel,
) => {
  // 未登录 / 获得链接的任何人
  if (collection.my.permissionLevel === null) {
    return (
      comparePermissionLevels(
        collection.anyonePermissionLevel,
        permissionLevel,
      ) >= 0
    );
  }

  // 默认权限等级的协作者
  if (collection.my.permissionLevel === "default") {
    return (
      comparePermissionLevels(
        collection.collaboratorPermissionLevel,
        permissionLevel,
      ) >= 0
    );
  }

  // 明确权限等级的协作者
  return (
    comparePermissionLevels(collection.my.permissionLevel, permissionLevel) >= 0
  );
};
