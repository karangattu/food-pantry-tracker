import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const isLocal = !process.env.TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL.startsWith("file:");

export const db = drizzle({
  connection: isLocal
    ? { url: process.env.TURSO_DATABASE_URL || "file:local.db" }
    : {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      },
  schema,
});
