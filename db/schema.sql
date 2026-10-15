-- My Coffee — schema
-- MVP: products, orders, order_items. No users/auth table (no login in scope).

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,            -- 'beans' | 'equipment' | 'cups'
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  in_stock    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders are only stored once the (simulated) payment succeeded.
-- public_id is the unguessable id used in the confirmation URL;
-- idempotency_key makes a double submit return the same order.
CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  public_id        UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  idempotency_key  UUID NOT NULL UNIQUE,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city    TEXT NOT NULL,
  shipping_zip     TEXT NOT NULL,
  subtotal_cents   INTEGER NOT NULL CHECK (subtotal_cents > 0),
  shipping_cents   INTEGER NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
  total_cents      INTEGER NOT NULL CHECK (total_cents > 0),
  status           TEXT NOT NULL DEFAULT 'paid',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id               SERIAL PRIMARY KEY,
  order_id         INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id       INTEGER NOT NULL REFERENCES products(id),
  product_name     TEXT NOT NULL,    -- snapshot at purchase time
  unit_price_cents INTEGER NOT NULL, -- snapshot at purchase time
  quantity         INTEGER NOT NULL CHECK (quantity > 0)
);

-- Newsletter sign-ups. Emails are stored lower-case; a repeat sign-up is a no-op.
CREATE TABLE IF NOT EXISTS subscribers (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
