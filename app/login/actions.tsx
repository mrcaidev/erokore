"use server";

import { and, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/database/client";
import { usersTable } from "@/database/schema";
import { signJwt } from "@/utils/jwt";
import { verifyPassword } from "@/utils/password";

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

  const jwt = await signJwt({ id: user.id });

  const cookieStore = await cookies();
  cookieStore.set("token", jwt, { httpOnly: true, secure: true });

  return redirect("/");
}
