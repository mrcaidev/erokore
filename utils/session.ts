import { cookies } from "next/headers";
import { signJwt, verifyJwt } from "./jwt";
import type { User } from "./types";

const COOKIE_KEY = "session";

export type Session = Pick<User, "id">;

export const getSession = async () => {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(COOKIE_KEY)?.value;

  // 未登录
  if (!jwt) {
    return undefined;
  }

  try {
    const session = await verifyJwt<Session>(jwt);
    return session;
  } catch {
    // JWT 验证失败
    return undefined;
  }
};

export const setSession = async (session: Session) => {
  const jwt = await signJwt(session);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEY, jwt, { httpOnly: true, secure: true });
};

export const clearSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEY);
};
