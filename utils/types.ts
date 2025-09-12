import type {
  collectionItemsTable,
  collectionsTable,
  defaultablePermissionLevelEnum,
  permissionLevelEnum,
  usersTable,
} from "@/database/schema";

/**
 * 完整的用户信息，仅服务端可见
 */
export type FullUser = typeof usersTable.$inferSelect;

/**
 * 私密的用户信息，仅用户本人可见
 */
export type PrivateUser = Omit<FullUser, "passwordSalt" | "passwordHash">;

/**
 * 公开的用户信息，所有人可见
 */
export type PublicUser = Omit<
  PrivateUser,
  "createdAt" | "updatedAt" | "deletedAt"
>;

/**
 * 用户在作品集上的权限等级
 */
export type PermissionLevel = (typeof permissionLevelEnum.enumValues)[number];

/**
 * 用户在作品集上的权限等级（可默认）
 */
export type DefaultablePermissionLevel =
  (typeof defaultablePermissionLevelEnum.enumValues)[number];

/**
 * 作品集
 */
export type Collection = typeof collectionsTable.$inferSelect;

/**
 * 作品
 */
export type CollectionItem = typeof collectionItemsTable.$inferSelect;
