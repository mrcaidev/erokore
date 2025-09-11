"use server";

import { and, eq, isNull } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/database/client";
import { usersTable } from "@/database/schema";
import { signJwt, verifyJwt } from "@/utils/jwt";
import { generateSalt, hashPassword } from "@/utils/password";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("session")?.value;
  if (!jwt) {
    return undefined;
  }
  try {
    const user = await verifyJwt(jwt);
    return user;
  } catch {
    return redirect("/sign-in");
  }
});

type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
};

export const signUp = async ({ email, password, nickname }: SignUpRequest) => {
  const [emailConflictedUser] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));

  if (emailConflictedUser) {
    return { error: "邮箱已注册" };
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

  const jwt = await signJwt(user);
  const cookieStore = await cookies();
  cookieStore.set("session", jwt, { httpOnly: true, secure: true });

  return redirect("/");
};

type SignInRequest = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: SignInRequest) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));

  if (!user) {
    return { error: "邮箱未注册" };
  }

  const passwordHash = await hashPassword(password, user.passwordSalt);
  const verified = passwordHash === user.passwordHash;

  if (!verified) {
    return { error: "密码错误" };
  }

  const jwt = await signJwt(user);
  const cookieStore = await cookies();
  cookieStore.set("session", jwt, { httpOnly: true, secure: true });

  return redirect("/");
};

export const signOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("session");
};
