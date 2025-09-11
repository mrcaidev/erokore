"use server";

import { and, eq, isNull } from "drizzle-orm";
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
    return { ok: false, error: "邮箱未注册" } as const;
  }

  const passed = await verifyPassword(
    password,
    user.passwordSalt,
    user.passwordHash,
  );

  if (!passed) {
    return { ok: false, error: "密码错误" } as const;
  }

  const jwt = await signJwt({ id: user.id });

  return {
    ok: true,
    user: {
      id: user.id,
      slug: user.slug,
      email: user.email,
      nickname: user.nickname,
    },
    jwt,
  } as const;
}
