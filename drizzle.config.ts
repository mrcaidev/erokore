import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./database/schema.ts",
  dbCredentials: {
    url: process.env.POSTGRES_URL ?? "",
  },
  casing: "snake_case",
});
