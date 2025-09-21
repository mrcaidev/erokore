"use server";

import type { Route } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { insertOneUser, selectOneUserByEmail } from "@/database/user";
import { generateSalt, hashPassword } from "@/utils/password";
import { clearSession, setSession } from "@/utils/session";

type SignUpReq = {
  email: string;
  password: string;
  nickname: string;
};

export const signUp = async (req: SignUpReq) => {
  const emailConflictedUser = await selectOneUserByEmail(req.email);

  if (emailConflictedUser) {
    return { error: "邮箱已注册" };
  }

  const passwordSalt = generateSalt();
  const passwordHash = await hashPassword(req.password, passwordSalt);

  const user = await insertOneUser({
    email: req.email,
    nickname: req.nickname,
    passwordSalt,
    passwordHash,
  });

  if (!user) {
    return { error: "注册失败，请稍后重试" };
  }

  await setSession({ id: user.id });

  revalidatePath("/", "layout");

  return redirect("/");
};

type SignInReq = {
  email: string;
  password: string;
  next: Route;
};

export const signIn = async (req: SignInReq) => {
  const user = await selectOneUserByEmail(req.email);

  if (!user) {
    return { error: "邮箱未注册" };
  }

  const passwordHash = await hashPassword(req.password, user.passwordSalt);

  if (passwordHash !== user.passwordHash) {
    return { error: "密码错误" };
  }

  await setSession({ id: user.id });

  revalidatePath("/", "layout");

  return redirect(req.next);
};

export const signOut = async () => {
  await clearSession();

  revalidatePath("/", "layout");

  return redirect("/sign-in");
};
