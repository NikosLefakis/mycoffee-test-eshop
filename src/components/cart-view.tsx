"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { ProductVisual } from "@/components/product-visual";
import { buttonVariants } from "@/components/ui/button";
import {
  MAX_QUANTITY,
  removeFromCart,
  setQuantity,
  useCart,
} from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { cn } from "cn";

export function CartView() {
  const { items, ready, subtotalCents } = useCart();

  if (!ready) {
    return <p className="mt-10 text-muted-foreground">Φόρτωση…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-muted-foreground">Το καλάθι σου είναι άδειο.</p>
        <Link
          href="/products"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 h-12 rounded-none px-8")}
        >
          Συνέχισε τις αγορές
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_340px]">
      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-5 py-6">
            <Link
              href={`/products/${item.slug}`}
              className="block h-32 w-24 shrink-0 overflow-hidden bg-secondary"
            >
              <ProductVisual slug={item.slug} name={item.name} sizes="96px" />
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex justify-between gap-4">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-sm tabular-nums">
                  {formatPrice(item.priceCents * item.quantity)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    aria-label={`Μείωση ποσότητας: ${item.name}`}
                    className="grid size-9 place-items-center hover:bg-muted"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  >
                    <Icon name="remove" className="text-[18px]" />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Αύξηση ποσότητας: ${item.name}`}
                    className="grid size-9 place-items-center hover:bg-muted disabled:opacity-40"
                    disabled={item.quantity >= MAX_QUANTITY}
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  >
                    <Icon name="add" className="text-[18px]" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Αφαίρεση: ${item.name}`}
                  className="inline-flex h-10 items-center gap-1 px-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => removeFromCart(item.productId)}
                >
                  <Icon name="close" className="text-[16px]" />
                  Αφαίρεση
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit bg-secondary/60 p-7">
        <h2 className="font-heading text-2xl">Σύνοψη</h2>
        <div className="mt-6 flex justify-between text-sm">
          <span>Υποσύνολο</span>
          <span className="tabular-nums">{formatPrice(subtotalCents)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Το τελικό σύνολο υπολογίζεται στο checkout.
        </p>
        <Link
          href="/checkout"
          className={cn(buttonVariants({ size: "lg" }), "mt-7 h-12 w-full rounded-none")}
        >
          Ολοκλήρωση παραγγελίας
        </Link>
      </aside>
    </div>
  );
}
