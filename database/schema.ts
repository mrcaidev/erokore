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

const timestamptzs = {
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
    ...timestamptzs,
  },
  (table) => [
    // 对于未删除的用户，邮箱唯一
    uniqueIndex()
      .on(table.email)
      .where(sql`${table.deletedAt} is null`),
  ],
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  ownedCollections: many(collectionsTable),
}));

const permissionLevels = [
  // 不可见：用户没有任何权限
  "none",
  // 可查看：用户可以查看、关注作品集
  "viewer",
  // 可评价：在可查看的基础上，用户还可以点赞、点踩、评论作品集中的作品
  "rater",
  // 可贡献：在可评价的基础上，用户还可以添加、编辑、删除作品集中的作品
  "contributor",
  // 可管理：在可贡献的基础上，用户还可以编辑作品集、邀请协作者、调整权限等级低于自己的协作者的权限等级
  "admin",
  // 创建者：在可管理的基础上，用户还可以删除作品集
  "owner",
] as const;

export const permissionLevelEnum = pgEnum("permissionLevel", permissionLevels);

const defaultablePermissionLevels = [
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
  // 创建者
  ownerId: integer()
    .notNull()
    .references(() => usersTable.id),
  // 协作者的默认权限等级
  collaboratorPermissionLevel: permissionLevelEnum()
    .notNull()
    .default("contributor"),
  // 互联网上获得链接的所有人的权限等级
  everyonePermissionLevel: permissionLevelEnum().notNull().default("none"),
  // 审计时间
  ...timestamptzs,
});

export const collectionsRelations = relations(collectionsTable, ({ one }) => ({
  owner: one(usersTable, {
    fields: [collectionsTable.ownerId],
    references: [usersTable.id],
  }),
}));

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
  // 审计时间
  ...timestamptzs,
});

export const collaboratorsTable = pgTable("collaborators", {
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
  ...timestamptzs,
});

export const subscriptionsTable = pgTable("subscriptions", {
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
  ...timestamptzs,
});
