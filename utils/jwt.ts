import { sign, verify } from "jsonwebtoken";

export type JwtPayload = {
  id: number;
};

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export async function signJwt(payload: JwtPayload) {
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
}

export async function verifyJwt(jwt: string) {
  return new Promise<JwtPayload>((resolve, reject) => {
    verify(jwt, JWT_SECRET, (error, payload) => {
      if (error) {
        return reject(error);
      }
      if (!payload || typeof payload !== "object") {
        return reject(new Error(""));
      }
      return resolve(payload as JwtPayload);
    });
  });
}
