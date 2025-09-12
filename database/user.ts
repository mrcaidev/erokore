import { db } from "./client";
import { usersTable } from "./schema";

export const findOnePrivateUserById = async (id: number) => {
  const user = await db.query.usersTable.findFirst({
    columns: { passwordSalt: false, passwordHash: false },
    where: (usersTable, { and, eq, isNull }) =>
      and(eq(usersTable.id, id), isNull(usersTable.deletedAt)),
  });
  return user;
};

export const findOneFullUserByEmail = async (email: string) => {
  const user = await db.query.usersTable.findFirst({
    where: (usersTable, { and, eq, isNull }) =>
      and(eq(usersTable.email, email), isNull(usersTable.deletedAt)),
  });
  return user;
};

export const insertOneUser = async (value: typeof usersTable.$inferInsert) => {
  const [user] = await db.insert(usersTable).values(value).returning();
  return user;
};
