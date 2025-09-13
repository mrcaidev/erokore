import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

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
    // 物理 ID
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // 业务 ID
    slug: text()
      .notNull()
      .unique()
      .$default(() => nanoid(10)),
    // 邮箱
    email: text().notNull(),
    // 昵称
    nickname: text().notNull(),
    // 头像 URL
    avatarUrl: text().notNull().default(""),
    // 密码盐
    passwordSalt: text().notNull(),
    // 密码加盐哈希
    passwordHash: text().notNull(),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 对于未删除的用户，邮箱唯一
    uniqueIndex()
      .on(table.email)
      .where(sql`${table.deletedAt} is null`),
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
}));

const auditUsers = {
  // 创建者 ID
  createdBy: integer()
    .notNull()
    .references(() => usersTable.id),
  // 最后更新者 ID
  updatedBy: integer()
    .notNull()
    .references(() => usersTable.id),
  // 删除者 ID
  deletedBy: integer().references(() => usersTable.id),
};

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

export const permissionLevelEnum = pgEnum("permissionLevel", permissionLevels);

export const defaultablePermissionLevels = [
  ...permissionLevels,
  // 默认：跟随另外某处指定的默认值
  "default",
] as const;

export const defaultablePermissionLevelEnum = pgEnum(
  "defaultablePermissionLevel",
  defaultablePermissionLevels,
);

export const collectionsTable = pgTable("collections", {
  // 物理 ID
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // 业务 ID
  slug: text()
    .notNull()
    .unique()
    .$default(() => nanoid(10)),
  // 标题
  title: text().notNull(),
  // 描述
  description: text().notNull(),
  // 协作者的默认权限等级
  collaboratorPermissionLevel: permissionLevelEnum()
    .notNull()
    .default("contributor"),
  // 获得链接的任何人的权限等级
  anyonePermissionLevel: permissionLevelEnum().notNull().default("none"),
  // 审计时间
  ...auditTimestamps,
  // 审计用户
  ...auditUsers,
});

export const collectionsRelations = relations(
  collectionsTable,
  ({ one, many }) => ({
    items: many(collectionItemsTable, {
      relationName: "collection_comprise_items",
    }),
    collaborations: many(collaborationsTable, {
      relationName: "collection_have_collaborations",
    }),
    subscriptions: many(subscriptionsTable, {
      relationName: "collection_have_subscriptions",
    }),
    creator: one(usersTable, {
      fields: [collectionsTable.createdBy],
      references: [usersTable.id],
      relationName: "user_create_collections",
    }),
    updater: one(usersTable, {
      fields: [collectionsTable.updatedBy],
      references: [usersTable.id],
      relationName: "user_update_collections",
    }),
    deleter: one(usersTable, {
      fields: [collectionsTable.deletedBy],
      references: [usersTable.id],
      relationName: "user_delete_collections",
    }),
  }),
);

export const collectionItemsTable = pgTable("collectionItems", {
  // 物理 ID
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  // 业务 ID
  slug: text()
    .notNull()
    .unique()
    .$default(() => nanoid(10)),
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
  collectionId: integer()
    .notNull()
    .references(() => collectionsTable.id),
  // 审计时间
  ...auditTimestamps,
  // 审计用户
  ...auditUsers,
});

export const collectionItemsRelations = relations(
  collectionItemsTable,
  ({ one }) => ({
    collection: one(collectionsTable, {
      fields: [collectionItemsTable.collectionId],
      references: [collectionsTable.id],
      relationName: "collection_comprise_items",
    }),
    creator: one(usersTable, {
      fields: [collectionItemsTable.createdBy],
      references: [usersTable.id],
      relationName: "user_create_collectionItems",
    }),
    updater: one(usersTable, {
      fields: [collectionItemsTable.updatedBy],
      references: [usersTable.id],
      relationName: "user_update_collectionItems",
    }),
    deleter: one(usersTable, {
      fields: [collectionItemsTable.deletedBy],
      references: [usersTable.id],
      relationName: "user_delete_collectionItems",
    }),
  }),
);

export const collaborationsTable = pgTable(
  "collaborations",
  {
    // 物理 ID
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // 用户 ID
    userId: integer()
      .notNull()
      .references(() => usersTable.id),
    // 作品集 ID
    collectionId: integer()
      .notNull()
      .references(() => collectionsTable.id),
    // 权限等级
    permissionLevel: defaultablePermissionLevelEnum().notNull(),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 用户-作品集对唯一
    uniqueIndex().on(table.userId, table.collectionId),
  ],
);

export const collaborationsRelations = relations(
  collaborationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [collaborationsTable.userId],
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

export const subscriptionsTable = pgTable(
  "subscriptions",
  {
    // 物理 ID
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    // 用户 ID
    userId: integer()
      .notNull()
      .references(() => usersTable.id),
    // 作品集 ID
    collectionId: integer()
      .notNull()
      .references(() => collectionsTable.id),
    // 审计时间
    ...auditTimestamps,
  },
  (table) => [
    // 用户-作品集对唯一
    uniqueIndex().on(table.userId, table.collectionId),
  ],
);

export const subscriptionsRelations = relations(
  subscriptionsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [subscriptionsTable.userId],
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
