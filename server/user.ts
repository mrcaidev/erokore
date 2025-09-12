"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import {
  findOneFullUserByEmail,
  findOnePrivateUserById,
  insertOneUser,
} from "@/database/user";
import { signJwt, verifyJwt } from "@/utils/jwt";
import { generateSalt, hashPassword } from "@/utils/password";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("session")?.value;

  // 未登录
  if (!jwt) {
    return undefined;
  }

  try {
    const { id } = await verifyJwt<{ id: number }>(jwt);

    const user = await findOnePrivateUserById(id);

    // 用户不存在
    if (!user) {
      return undefined;
    }

    return user;
  } catch {
    // JWT 验证失败
    return undefined;
  }
});

type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
};

export const signUp = async ({ email, password, nickname }: SignUpRequest) => {
  const emailConflictedUser = await findOneFullUserByEmail(email);

  if (emailConflictedUser) {
    return { error: "邮箱已注册" };
  }

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  const user = await insertOneUser({
    email,
    nickname,
    passwordSalt,
    passwordHash,
  });

  if (!user) {
    return { error: "注册失败，请稍后重试" };
  }

  const jwt = await signJwt({ id: user.id });
  const cookieStore = await cookies();
  cookieStore.set("session", jwt, { httpOnly: true, secure: true });

  return redirect("/");
};

type SignInRequest = {
  email: string;
  password: string;
};

export const signIn = async ({ email, password }: SignInRequest) => {
  const user = await findOneFullUserByEmail(email);

  if (!user) {
    return { error: "邮箱未注册" };
  }

  const passwordHash = await hashPassword(password, user.passwordSalt);

  if (passwordHash !== user.passwordHash) {
    return { error: "密码错误" };
  }

  const jwt = await signJwt({ id: user.id });
  const cookieStore = await cookies();
  cookieStore.set("session", jwt, { httpOnly: true, secure: true });

  return redirect("/");
};

export const signOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("session");

  return redirect("/sign-in");
};
