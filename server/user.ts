"use server";

import { nanoid } from "nanoid";
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
import type { FullUser } from "@/utils/types";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("session")?.value;

  // 如果 cookie 里没有 session，说明用户还没有登录。
  // 不用强制重定向，因为部分页面无需登录也能访问。
  if (!jwt) {
    return undefined;
  }

  try {
    const { id } = await verifyJwt(jwt);

    const user = await findOnePrivateUserById(id);

    // 如果找不到用户，说明用户被删除了，强制重定向到登录页。
    if (!user) {
      return redirect("/sign-in");
    }

    return user;
  } catch {
    // 如果验证 JWT 失败，说明用户的登录状态已经过期，强制重定向到登录页。
    return redirect("/sign-in");
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

  const user: FullUser = {
    id: nanoid(8),
    email,
    nickname,
    avatarUrl: "",
    passwordSalt,
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  await insertOneUser(user);

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
  const verified = passwordHash === user.passwordHash;

  if (!verified) {
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
