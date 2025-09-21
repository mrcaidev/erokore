export const permissionLevels = [
  // 不可见：用户没有任何权限
  "none",
  // 可查看：用户可以查看、关注作品集，查看作品集中的作品，查看协作者
  "viewer",
  // 可评价：在可查看的基础上，用户还可以点赞、点踩、评论作品集中的作品
  "rater",
  // 可贡献：在可评价的基础上，用户还可以添加、编辑、删除作品集中的作品
  "contributor",
  // 可管理：在可贡献的基础上，用户还可以编辑作品集，邀请协作者，调整、移除权限等级低于自己的协作者
  "admin",
  // 创建者：在可管理的基础上，用户还可以删除作品集
  "owner",
] as const;

export const defaultablePermissionLevels = [
  ...permissionLevels,
  // 默认：跟随另外某处指定的默认值
  "default",
] as const;

export const attitudes = ["liked", "disliked"] as const;
