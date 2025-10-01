import { relations, sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import {
  ATTITUDES,
  DEFAULTABLE_PERMISSION_LEVELS,
  PERMISSION_LEVELS,
} from "@/constants/enums";

const auditTimestamps = {
  // 创建时间
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  // 最后更新时间
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  // 删除时间
  deletedAt: timestamp({ withTimezone: true }),
};

export const usersTable = pgTable(
  "users",
  {
    // ID
    id: uuid().primaryKey().defaultRandom(),
    // QQ
    qq: text().notNull(),
    // 昵称
    nickname: text().notNull(),
    // 头像 URL
    avatarUrl: text().notNull().default(""),
    // 密码盐
    passwordSalt: text().notNull().default(""),
    // 密码加盐哈希
    passwordHash: text().notNull().default(""),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 对于未删除的用户，QQ 唯一
    uniqueIndex()
      .on(table.qq)
      .where(sql`${table.deletedAt} is null`),
  ],
);

const auditUsers = {
  // 创建者 ID
  creatorId: uuid()
    .notNull()
    .references(() => usersTable.id),
  // 最后更新者 ID
  updaterId: uuid()
    .notNull()
    .references(() => usersTable.id),
  // 删除者 ID
  deleterId: uuid().references(() => usersTable.id),
};

export const permissionLevelEnum = pgEnum("permissionLevel", PERMISSION_LEVELS);

export const defaultablePermissionLevelEnum = pgEnum(
  "defaultablePermissionLevel",
  DEFAULTABLE_PERMISSION_LEVELS,
);

export const collectionsTable = pgTable("collections", {
  // ID
  id: uuid().primaryKey().defaultRandom(),
  // 标题
  title: text().notNull(),
  // 描述
  description: text().notNull(),
  // 协作者的默认权限等级
  collaboratorPermissionLevel: permissionLevelEnum().notNull(),
  // 获得链接的任何人的权限等级
  anyonePermissionLevel: permissionLevelEnum().notNull(),
  // 审计时间
  ...auditTimestamps,
  // 审计用户
  ...auditUsers,
});

export const collaborationsTable = pgTable(
  "collaborations",
  {
    // ID
    id: uuid().primaryKey().defaultRandom(),
    // 协作者 ID
    collaboratorId: uuid()
      .notNull()
      .references(() => usersTable.id),
    // 作品集 ID
    collectionId: uuid()
      .notNull()
      .references(() => collectionsTable.id),
    // 权限等级
    permissionLevel: defaultablePermissionLevelEnum().notNull(),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 协作者-作品集对唯一
    uniqueIndex().on(table.collaboratorId, table.collectionId),
  ],
);

export const subscriptionsTable = pgTable(
  "subscriptions",
  {
    // ID
    id: uuid().primaryKey().defaultRandom(),
    // 订阅者 ID
    subscriberId: uuid()
      .notNull()
      .references(() => usersTable.id),
    // 作品集 ID
    collectionId: uuid()
      .notNull()
      .references(() => collectionsTable.id),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 订阅者-作品集对唯一
    uniqueIndex().on(table.subscriberId, table.collectionId),
  ],
);

export const invitationsTable = pgTable(
  "invitations",
  {
    // ID
    id: uuid().primaryKey().defaultRandom(),
    // 邀请者 ID
    inviterId: uuid()
      .notNull()
      .references(() => usersTable.id),
    // 作品集 ID
    collectionId: uuid()
      .notNull()
      .references(() => collectionsTable.id),
    // 邀请码
    code: text()
      .notNull()
      .$default(() => nanoid(8)),
    // 权限等级
    permissionLevel: defaultablePermissionLevelEnum().notNull(),
    // 过期时间
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 作品集-邀请码对唯一
    uniqueIndex().on(table.collectionId, table.code),
  ],
);

export const collectionItemsTable = pgTable("collectionItems", {
  // ID
  id: uuid().primaryKey().defaultRandom(),
  // 来源
  source: text().notNull(),
  // 标题
  title: text().notNull(),
  // 描述
  description: text().notNull(),
  // URL
  url: text().notNull(),
  // 封面 URL
  coverUrl: text().notNull(),
  // 作品集 ID
  collectionId: uuid()
    .notNull()
    .references(() => collectionsTable.id),
  // 审计时间
  ...auditTimestamps,
  // 审计用户
  ...auditUsers,
});

export const attitudeEnum = pgEnum("attitude", ATTITUDES);

export const reactionsTable = pgTable(
  "reactions",
  {
    // ID
    id: uuid().primaryKey().defaultRandom(),
    // 回应者 ID
    reactorId: uuid()
      .notNull()
      .references(() => usersTable.id),
    // 作品 ID
    collectionItemId: uuid()
      .notNull()
      .references(() => collectionItemsTable.id),
    // 点赞/无/点踩
    attitude: attitudeEnum(),
    // 评论
    comment: text().notNull().default(""),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 回应者-作品对唯一
    uniqueIndex().on(table.reactorId, table.collectionItemId),
  ],
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  createdCollections: many(collectionsTable, {
    relationName: "user_create_collections",
  }),
  updatedCollections: many(collectionsTable, {
    relationName: "user_update_collections",
  }),
  deletedCollections: many(collectionsTable, {
    relationName: "user_delete_collections",
  }),
  createdCollectionItems: many(collectionItemsTable, {
    relationName: "user_create_collectionItems",
  }),
  updatedCollectionItems: many(collectionItemsTable, {
    relationName: "user_update_collectionItems",
  }),
  deletedCollectionItems: many(collectionItemsTable, {
    relationName: "user_delete_collectionItems",
  }),
  collaborations: many(collaborationsTable, {
    relationName: "user_have_collaborations",
  }),
  subscriptions: many(subscriptionsTable, {
    relationName: "user_have_subscriptions",
  }),
  invitations: many(invitationsTable, {
    relationName: "user_have_invitations",
  }),
  reactions: many(reactionsTable, {
    relationName: "user_have_reactions",
  }),
}));

export const collectionsRelations = relations(
  collectionsTable,
  ({ one, many }) => ({
    items: many(collectionItemsTable, {
      relationName: "collection_have_items",
    }),
    collaborations: many(collaborationsTable, {
      relationName: "collection_have_collaborations",
    }),
    subscriptions: many(subscriptionsTable, {
      relationName: "collection_have_subscriptions",
    }),
    invitations: many(invitationsTable, {
      relationName: "collection_have_invitations",
    }),
    creator: one(usersTable, {
      fields: [collectionsTable.creatorId],
      references: [usersTable.id],
      relationName: "user_create_collections",
    }),
    updater: one(usersTable, {
      fields: [collectionsTable.updaterId],
      references: [usersTable.id],
      relationName: "user_update_collections",
    }),
    deleter: one(usersTable, {
      fields: [collectionsTable.deleterId],
      references: [usersTable.id],
      relationName: "user_delete_collections",
    }),
  }),
);

export const collaborationsRelations = relations(
  collaborationsTable,
  ({ one }) => ({
    collaborator: one(usersTable, {
      fields: [collaborationsTable.collaboratorId],
      references: [usersTable.id],
      relationName: "user_have_collaborations",
    }),
    collection: one(collectionsTable, {
      fields: [collaborationsTable.collectionId],
      references: [collectionsTable.id],
      relationName: "collection_have_collaborations",
    }),
  }),
);

export const subscriptionsRelations = relations(
  subscriptionsTable,
  ({ one }) => ({
    subscriber: one(usersTable, {
      fields: [subscriptionsTable.subscriberId],
      references: [usersTable.id],
      relationName: "user_have_subscriptions",
    }),
    collection: one(collectionsTable, {
      fields: [subscriptionsTable.collectionId],
      references: [collectionsTable.id],
      relationName: "collection_have_subscriptions",
    }),
  }),
);

export const invitationsRelations = relations(invitationsTable, ({ one }) => ({
  inviter: one(usersTable, {
    fields: [invitationsTable.inviterId],
    references: [usersTable.id],
    relationName: "user_have_invitations",
  }),
  collection: one(collectionsTable, {
    fields: [invitationsTable.collectionId],
    references: [collectionsTable.id],
    relationName: "collection_have_invitations",
  }),
}));

export const collectionItemsRelations = relations(
  collectionItemsTable,
  ({ one, many }) => ({
    reactions: many(reactionsTable, {
      relationName: "collectionItem_have_reactions",
    }),
    collection: one(collectionsTable, {
      fields: [collectionItemsTable.collectionId],
      references: [collectionsTable.id],
      relationName: "collection_have_items",
    }),
    creator: one(usersTable, {
      fields: [collectionItemsTable.creatorId],
      references: [usersTable.id],
      relationName: "user_create_collectionItems",
    }),
    updater: one(usersTable, {
      fields: [collectionItemsTable.updaterId],
      references: [usersTable.id],
      relationName: "user_update_collectionItems",
    }),
    deleter: one(usersTable, {
      fields: [collectionItemsTable.deleterId],
      references: [usersTable.id],
      relationName: "user_delete_collectionItems",
    }),
  }),
);

export const reactionsRelations = relations(reactionsTable, ({ one }) => ({
  reactor: one(usersTable, {
    fields: [reactionsTable.reactorId],
    references: [usersTable.id],
    relationName: "user_have_reactions",
  }),
  collectionItem: one(collectionItemsTable, {
    fields: [reactionsTable.collectionItemId],
    references: [collectionItemsTable.id],
    relationName: "collectionItem_have_reactions",
  }),
}));
