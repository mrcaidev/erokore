import type {
  attitudeEnum,
  collaborationsTable,
  collectionItemsTable,
  collectionsTable,
  defaultablePermissionLevelEnum,
  invitationsTable,
  permissionLevelEnum,
  sourceEnum,
  subscriptionsTable,
  usersTable,
} from "@/database/schema";

/**
 * 完整的用户信息，仅服务端可见
 */
export type User = typeof usersTable.$inferSelect;

/**
 * 私密的用户信息，仅用户本人可见
 */
export type PrivateUser = Omit<User, "passwordSalt" | "passwordHash">;

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
 * 填充过的作品集
 */
export type EnrichedCollection = Collection & {
  creator: PublicUser;
  updater: PublicUser;
};

/**
 * 个性化的作品集
 */
export type PersonalizedCollection = EnrichedCollection & {
  my: {
    permissionLevel: DefaultablePermissionLevel | null;
    subscribed: boolean;
  };
};

/**
 * 作品来源
 */
export type Source = (typeof sourceEnum.enumValues)[number];

/**
 * 作品
 */
export type CollectionItem = typeof collectionItemsTable.$inferSelect;

/**
 * 态度
 */
export type Attitude = (typeof attitudeEnum.enumValues)[number];

/**
 * 填充过的作品
 */
export type EnrichedCollectionItem = CollectionItem & {
  creator: PublicUser;
  updater: PublicUser;
};

/**
 * 个性化的作品
 */
export type PersonalizedCollectionItem = EnrichedCollectionItem & {
  my: {
    attitude: Attitude | null;
    comment: string;
  };
};

/**
 * 协作
 */
export type Collaboration = typeof collaborationsTable.$inferSelect;

/**
 * 关注
 */
export type Subscription = typeof subscriptionsTable.$inferSelect;

/**
 * 邀请
 */
export type Invitation = typeof invitationsTable.$inferSelect;

/**
 * 个性化的邀请
 */
export type PersonalizedInvitation = Invitation & {
  inviter: PublicUser;
  collection: PersonalizedCollection;
};
