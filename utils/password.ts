import { randomBytes, scrypt } from "node:crypto";

export const generateSalt = () => {
  return randomBytes(16).toString("hex");
};

export const hashPassword = async (password: string, salt: string) => {
  return new Promise<string>((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        return reject(error);
      }
      return resolve(derivedKey.toString("hex"));
    });
  });
};
