/**
 * 公开的用户信息，所有人可见。
 */
export type PublicUser = {
  /**
   * 唯一标识符，8 位 Nano ID。
   */
  id: string;
  /**
   * 邮箱。
   */
  email: string;
  /**
   * 昵称。
   */
  nickname: string;
  /**
   * 头像 URL。
   */
  avatarUrl: string;
};

/**
 * 私密的用户信息，仅用户本人可见。
 */
export type PrivateUser = PublicUser & {
  /**
   * 创建时间。
   */
  createdAt: Date;
  /**
   * 最后更新时间。
   */
  updatedAt: Date;
  /**
   * 删除时间。
   */
  deletedAt: Date | null;
};

/**
 * 完整的用户信息，仅服务端可见。
 */
export type FullUser = PrivateUser & {
  /**
   * 密码的盐，16 字节 hex 字符串。
   */
  passwordSalt: string;
  /**
   * 密码的加盐哈希。
   */
  passwordHash: string;
};

/**
 * 用户在作品集上的权限等级。
 */
export const PermissionLevel = {
  /**
   * 用户没有任何权限。
   */
  None: 0,
  /**
   * 用户可以查看、关注作品集。
   */
  View: 1,
  /**
   * 用户除了查看、关注，还可以点赞、点踩、评论作品集中的作品。
   */
  Rate: 2,
  /**
   * 用户除了查看、关注、点赞、点踩、评论，还可以添加、编辑、删除作品集中的作品。
   */
  Contribute: 3,
} as const;

/**
 * 用户在作品集上的权限等级。
 */
export type PermissionLevel =
  (typeof PermissionLevel)[keyof typeof PermissionLevel];

/**
 * 作品。
 */
export type CollectionItem = {
  /**
   * 唯一标识符，21 位 Nano ID。
   */
  id: string;
  /**
   * 类型。
   */
  type: "av" | "manga";
  /**
   * 来源。
   */
  source: string;
  /**
   * 标题。
   */
  title: string;
  /**
   * 描述。
   */
  description: string;
  /**
   * URL。
   */
  url: string;
  /**
   * 封面 URL。
   */
  coverUrl: string;
  /**
   * 其它元数据。
   */
  [key: string]: any;
};

/**
 * 作品集。
 */
export type Collection = {
  /**
   * 唯一标识符，8 位 Nano ID。
   */
  id: string;
  /**
   * 标题。
   */
  title: string;
  /**
   * 描述。
   */
  description: string;
  /**
   * 创建者。固定拥有全部权限。
   */
  owner: PublicUser;
  /**
   * 协作者。
   */
  collaborators: (PublicUser & {
    /**
     * 协作者的权限等级。指定为 `default` 时，其实际值为 `collaboratorDefaultPermissionLevel`。
     */
    permissionLevel: "default" | PermissionLevel;
  })[];
  /**
   * 协作者的默认权限等级。
   */
  collaboratorDefaultPermissionLevel: PermissionLevel;
  /**
   * 所有人的权限等级。
   */
  everyonePermissionLevel: PermissionLevel;
  /**
   * 作品列表。
   */
  items: CollectionItem[];
  /**
   * 创建时间。
   */
  createdAt: Date;
  /**
   * 最后更新时间。
   */
  updatedAt: Date;
  /**
   * 删除时间。
   */
  deletedAt: Date | null;
};
