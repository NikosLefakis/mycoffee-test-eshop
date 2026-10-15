import { pool } from "@/lib/db";
import type { CustomerData } from "@/lib/checkout-schema";

export type OrderLine = {
  productId: number;
  name: string;
  unitPriceCents: number;
  quantity: number;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function orderTotals(lines: OrderLine[]) {
  const subtotalCents = lines.reduce(
    (sum, l) => sum + l.unitPriceCents * l.quantity,
    0,
  );
  const shippingCents = 0;
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}

/**
 * Stores a paid order and its items in one transaction. If the same
 * idempotency key was already used, returns the existing order instead.
 */
export async function createOrder(input: {
  idempotencyKey: string;
  customer: CustomerData;
  lines: OrderLine[];
}): Promise<{ publicId: string }> {
  const { idempotencyKey, customer, lines } = input;
  const { subtotalCents, shippingCents, totalCents } = orderTotals(lines);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const inserted = await client.query<{ id: number; public_id: string }>(
      `INSERT INTO orders
         (idempotency_key, customer_name, customer_email, customer_phone,
          shipping_address, shipping_city, shipping_zip,
          subtotal_cents, shipping_cents, total_cents)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (idempotency_key) DO NOTHING
       RETURNING id, public_id`,
      [
        idempotencyKey,
        customer.name,
        customer.email,
        customer.phone,
        customer.address,
        customer.city,
        customer.zip,
        subtotalCents,
        shippingCents,
        totalCents,
      ],
    );

    if (inserted.rowCount === 0) {
      await client.query("ROLLBACK");
      const existing = await pool.query<{ public_id: string }>(
        "SELECT public_id FROM orders WHERE idempotency_key = $1",
        [idempotencyKey],
      );
      return { publicId: existing.rows[0].public_id };
    }

    const { id, public_id } = inserted.rows[0];
    await client.query(
      `INSERT INTO order_items
         (order_id, product_id, product_name, unit_price_cents, quantity)
       SELECT $1, * FROM unnest($2::int[], $3::text[], $4::int[], $5::int[])`,
      [
        id,
        lines.map((l) => l.productId),
        lines.map((l) => l.name),
        lines.map((l) => l.unitPriceCents),
        lines.map((l) => l.quantity),
      ],
    );
    await client.query("COMMIT");
    return { publicId: public_id };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export type OrderDetails = {
  publicId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  createdAt: Date;
  items: {
    productName: string;
    slug: string | null;
    unitPriceCents: number;
    quantity: number;
  }[];
};

export async function getOrderByPublicId(
  publicId: string,
): Promise<OrderDetails | null> {
  if (!UUID_RE.test(publicId)) return null;

  const order = await pool.query(
    `SELECT id, public_id, customer_name, customer_email, shipping_address,
            shipping_city, shipping_zip, subtotal_cents, shipping_cents,
            total_cents, created_at
       FROM orders WHERE public_id = $1`,
    [publicId],
  );
  const o = order.rows[0];
  if (!o) return null;

  const items = await pool.query(
    `SELECT oi.product_name, oi.unit_price_cents, oi.quantity, p.slug
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = $1
      ORDER BY oi.id`,
    [o.id],
  );

  return {
    publicId: o.public_id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    shippingAddress: o.shipping_address,
    shippingCity: o.shipping_city,
    shippingZip: o.shipping_zip,
    subtotalCents: o.subtotal_cents,
    shippingCents: o.shipping_cents,
    totalCents: o.total_cents,
    createdAt: o.created_at,
    items: items.rows.map((r) => ({
      productName: r.product_name,
      slug: r.slug,
      unitPriceCents: r.unit_price_cents,
      quantity: r.quantity,
    })),
  };
}
