import { cookies } from "next/headers";
import { signJwt, verifyJwt } from "./jwt";
import type { User } from "./types";

export async function getSession() {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("session")?.value;
  if (!jwt) {
    return undefined;
  }
  const user = await verifyJwt(jwt);
  return user;
}

export async function setSession(user: User) {
  const cookieStore = await cookies();
  const jwt = await signJwt(user);
  cookieStore.set("session", jwt, { httpOnly: true, secure: true });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
