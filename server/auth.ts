"use server";

import { redirect } from "next/navigation";
import { cache } from "react";
import {
  insertOneUser,
  selectOnePrivateUserById,
  selectOneUserByEmail,
} from "@/database/user";
import { generateSalt, hashPassword } from "@/utils/password";
import { clearSession, getSession, setSession } from "@/utils/session";
import type { Route } from "next";

export const findCurrentUser = cache(async () => {
  const session = await getSession();

  if (!session) {
    return undefined;
  }

  const user = await selectOnePrivateUserById(session.id);
  return user;
});

type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
};

export const signUp = async ({ email, password, nickname }: SignUpRequest) => {
  const emailConflictedUser = await selectOneUserByEmail(email);

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

  await setSession({ id: user.id });

  return redirect("/");
};

type SignInRequest = {
  email: string;
  password: string;
  next: Route;
};

export const signIn = async ({ email, password, next }: SignInRequest) => {
  const user = await selectOneUserByEmail(email);

  if (!user) {
    return { error: "邮箱未注册" };
  }

  const passwordHash = await hashPassword(password, user.passwordSalt);

  if (passwordHash !== user.passwordHash) {
    return { error: "密码错误" };
  }

  await setSession({ id: user.id });

  return redirect(next);
};

export const signOut = async () => {
  await clearSession();

  return redirect("/sign-in");
};
