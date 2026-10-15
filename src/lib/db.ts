import { Pool } from "pg";

// pg treats sslmode=require as verify-full today and will change that in v9.
// Being explicit keeps the same (secure) behaviour after the upgrade.
const connectionString = process.env.POSTGRES_URL?.replace(
  "sslmode=require",
  "sslmode=verify-full",
);

// Reused across hot-reloads in dev so we don't open a new pool per request.
const globalForDb = globalThis as unknown as { pgPool?: Pool };

export const pool =
  globalForDb.pgPool ?? new Pool({ connectionString });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}
