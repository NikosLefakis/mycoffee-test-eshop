import { readFileSync } from "node:fs";
import pg from "pg";

if (!process.env.POSTGRES_URL) {
  console.error("Missing POSTGRES_URL. Put it in .env.local and run: npm run db:setup");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.POSTGRES_URL });
await client.connect();

try {
  await client.query("BEGIN");
  await client.query("DROP TABLE IF EXISTS subscribers, order_items, orders, products CASCADE");
  await client.query(readFileSync("db/schema.sql", "utf8"));
  await client.query(readFileSync("db/seed.sql", "utf8"));
  await client.query("COMMIT");
  const { rows } = await client.query("SELECT count(*) FROM products");
  console.log(`OK — ${rows[0].count} products seeded.`);
} catch (err) {
  await client.query("ROLLBACK");
  console.error("Setup failed:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
