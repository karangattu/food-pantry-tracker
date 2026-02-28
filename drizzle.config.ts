import { defineConfig } from "drizzle-kit";

const isLocal = !process.env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL.startsWith("file:");

export default defineConfig({
  dialect: isLocal ? "sqlite" : "turso",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: isLocal
    ? { url: process.env.TURSO_DATABASE_URL || "file:local.db" }
    : {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      },
});
