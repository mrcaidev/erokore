import { sign, verify } from "jsonwebtoken";
import type { User } from "./types";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export const signJwt = async (payload: User) => {
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

export const verifyJwt = async (jwt: string) => {
  return new Promise<User>((resolve, reject) => {
    verify(jwt, JWT_SECRET, (error, payload) => {
      if (error) {
        return reject(error);
      }
      if (!payload) {
        return reject(new Error(""));
      }
      return resolve(payload as User);
    });
  });
};
