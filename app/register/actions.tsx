"use server";

import { and, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/database/client";
import { usersTable } from "@/database/schema";
import { signJwt } from "@/utils/jwt";
import { generateSalt, hashPassword } from "@/utils/password";

type RegisterRequest = {
  email: string;
  password: string;
  nickname: string;
};

export async function register({ email, password, nickname }: RegisterRequest) {
  const [emailConflictedUser] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));

  if (emailConflictedUser) {
    return { error: "邮箱已被注册" };
  }

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  const [user] = await db
    .insert(usersTable)
    .values({ email, passwordSalt, passwordHash, nickname })
    .returning({
      id: usersTable.id,
      slug: usersTable.slug,
      email: usersTable.email,
      nickname: usersTable.nickname,
    });

  if (!user) {
    return { error: "注册失败，请重试" };
  }

  const jwt = await signJwt({ id: user.id });

  const cookieStore = await cookies();
  cookieStore.set("token", jwt, { httpOnly: true, secure: true });

  return redirect("/");
}
