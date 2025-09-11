"use server";

import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/database/client";
import { usersTable } from "@/database/schema";
import { verifyPassword } from "@/utils/password";
import { setSession } from "@/utils/session";

type LoginRequest = {
  email: string;
  password: string;
};

export async function login({ email, password }: LoginRequest) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));

  if (!user) {
    return { error: "邮箱未注册" };
  }

  const passed = await verifyPassword(
    password,
    user.passwordSalt,
    user.passwordHash,
  );

  if (!passed) {
    return { error: "密码错误" };
  }

  await setSession(user);
  return redirect("/");
}
