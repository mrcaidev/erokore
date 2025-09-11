import { randomBytes, scrypt } from "node:crypto";

export function generateSalt() {
  return randomBytes(16).toString("hex");
}

export async function hashPassword(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        return reject(error);
      }
      return resolve(derivedKey.toString("hex"));
    });
  });
}

export async function verifyPassword(
  attempt: string,
  salt: string,
  hash: string,
) {
  const attemptHash = await hashPassword(attempt, salt);
  return attemptHash === hash;
}
