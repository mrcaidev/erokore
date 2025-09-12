import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const signJwt = async (payload: object) => {
  return new Promise<string>((resolve, reject) => {
    sign(payload, JWT_SECRET, (error, jwt) => {
      if (error) {
        return reject(error);
      }
      if (!jwt) {
        return reject(new Error(""));
      }
      return resolve(jwt);
    });
  });
};

export const verifyJwt = async <T extends object>(jwt: string) => {
  return new Promise<T>((resolve, reject) => {
    verify(jwt, JWT_SECRET, (error, payload) => {
      if (error) {
        return reject(error);
      }
      if (!payload || typeof payload !== "object") {
        return reject(new Error(""));
      }
      return resolve(payload as T);
    });
  });
};
