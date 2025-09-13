import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const POSTGRES_URL = process.env.POSTGRES_URL ?? "";

export const db =
  process.env.NODE_ENV === "production"
    ? drizzleNeon(POSTGRES_URL, { schema })
    : drizzlePg(POSTGRES_URL, { schema });
