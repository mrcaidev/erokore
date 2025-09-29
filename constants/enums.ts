export const PERMISSION_LEVELS = [
  // 不可见：没有任何权限
  "none",
  // 可查看：可以查看、关注作品集，查看作品，查看协作者
  "viewer",
  // 可评价：在可查看的基础上，还可以点赞、点踩、评论作品
  "rater",
  // 可贡献：在可评价的基础上，还可以添加、编辑、移除作品
  "contributor",
  // 可管理：在可贡献的基础上，还可以编辑作品集，邀请协作者，编辑、移除权限等级低于自己的协作者
  "admin",
  // 创建者：在可管理的基础上，还可以删除作品集
  "owner",
] as const;

export const DEFAULTABLE_PERMISSION_LEVELS = [
  ...PERMISSION_LEVELS,
  // 默认：跟随别处指定的默认值
  "default",
] as const;

export const ATTITUDES = ["liked", "disliked"] as const;
