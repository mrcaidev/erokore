import type { InsertUser, User } from "@/utils/types";
import { db } from "./client";
import { usersTable } from "./schema";

export const selectOnePrivateUserById = async (id: User["id"]) => {
  const user = await db.query.usersTable.findFirst({
    columns: { passwordSalt: false, passwordHash: false },
    where: (usersTable, { and, eq, isNull }) =>
      and(eq(usersTable.id, id), isNull(usersTable.deletedAt)),
  });
  return user;
};

export const selectOneUserByEmail = async (email: User["email"]) => {
  const user = await db.query.usersTable.findFirst({
    where: (usersTable, { and, eq, isNull }) =>
      and(eq(usersTable.email, email), isNull(usersTable.deletedAt)),
  });
  return user;
};

export const insertOneUser = async (value: InsertUser) => {
  const [user] = await db.insert(usersTable).values(value).returning();
  return user;
};
