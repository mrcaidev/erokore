import { sign, verify } from "jsonwebtoken";
import type { FullUser } from "./types";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

type Payload = Pick<FullUser, "id">;

export const signJwt = async (payload: Payload) => {
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
  return new Promise<Payload>((resolve, reject) => {
    verify(jwt, JWT_SECRET, (error, payload) => {
      if (error) {
        return reject(error);
      }
      if (!payload || typeof payload !== "object") {
        return reject(new Error(""));
      }
      return resolve({ id: payload.id });
    });
  });
};
