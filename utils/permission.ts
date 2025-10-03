import type { DefaultablePermissionLevel, PermissionLevel } from "./types";

export const PERMISSION_LEVEL_LABEL_MAP: Record<PermissionLevel, string> = {
  none: "无权限",
  viewer: "可查看",
  rater: "可评价",
  contributor: "可贡献",
  admin: "可管理",
  owner: "创建者",
};

export const PERMISSION_LEVEL_WEIGHT_MAP: Record<PermissionLevel, number> = {
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
  return PERMISSION_LEVEL_WEIGHT_MAP[a] - PERMISSION_LEVEL_WEIGHT_MAP[b];
};

type Criteria = {
  anyonePermissionLevel: PermissionLevel;
  collaboratorPermissionLevel: PermissionLevel;
  myPermissionLevel: DefaultablePermissionLevel | null;
};

export const evaluatePermissionLevel = (criteria: Criteria) => {
  // 未登录 / 获得链接的任何人
  if (criteria.myPermissionLevel === null) {
    return criteria.anyonePermissionLevel;
  }
  // 默认权限等级的协作者
  if (criteria.myPermissionLevel === "default") {
    return criteria.collaboratorPermissionLevel;
  }
  // 明确权限等级的协作者
  return criteria.myPermissionLevel;
};

export const hasPermission = (
  criteria: Criteria,
  permissionLevel: PermissionLevel,
) => {
  return (
    comparePermissionLevels(
      evaluatePermissionLevel(criteria),
      permissionLevel,
    ) >= 0
  );
};
