import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: text()
    .notNull()
    .unique()
    .$default(() => nanoid(12)),
  email: text().notNull(),
  passwordSalt: text().notNull(),
  passwordHash: text().notNull(),
  nickname: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp({ withTimezone: true }),
});
