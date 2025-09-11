"use server";

import { and, eq, isNull } from "drizzle-orm";
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
  const emailConflictedUsers = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));

  if (emailConflictedUsers.length > 0) {
    return { ok: false, error: "邮箱已被注册" } as const;
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
    return { ok: false, error: "注册失败，请重试" } as const;
  }

  const jwt = await signJwt({ id: user.id });

  return { ok: true, user, jwt } as const;
}
