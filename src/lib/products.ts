import { cacheLife } from "next/cache";
import { pool } from "@/lib/db";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  description: string;
  price_cents: number;
  in_stock: boolean;
};

const COLUMNS = "id, slug, name, category, description, price_cents, in_stock";

// Catalogue reads are cached: the database is far from most visitors and the
// catalogue changes rarely. A product can therefore show a stale "in stock"
// label for up to an hour, which is why the checkout re-reads fresh data.
export async function getProducts(category?: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours");

  const { rows } = category
    ? await pool.query<Product>(
        `SELECT ${COLUMNS} FROM products WHERE category = $1 ORDER BY id`,
        [category],
      )
    : await pool.query<Product>(`SELECT ${COLUMNS} FROM products ORDER BY id`);
  return rows;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  "use cache";
  cacheLife("hours");

  const { rows } = await pool.query<Product>(
    `SELECT ${COLUMNS} FROM products WHERE slug = $1`,
    [slug],
  );
  return rows[0] ?? null;
}

// Not cached on purpose: the checkout needs current prices and stock.
export async function getProductsByIds(
  ids: number[],
): Promise<Product[]> {
  if (ids.length === 0) return [];
  const { rows } = await pool.query<Product>(
    `SELECT ${COLUMNS} FROM products WHERE id = ANY($1::int[])`,
    [ids],
  );
  return rows;
}
