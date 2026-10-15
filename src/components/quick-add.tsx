"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { addToCart, type CartItem } from "@/lib/cart-store";

export function QuickAdd({ product }: { product: Omit<CartItem, "quantity"> }) {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="flex h-11 w-full items-center justify-center gap-2 bg-primary text-[0.68rem] font-medium tracking-[0.14em] text-primary-foreground uppercase transition-colors hover:bg-primary/90"
      onClick={() => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
    >
      <Icon name={added ? "check" : "shopping_bag"} className="text-[18px]" />
      <span aria-live="polite">
        {added ? (
          "Προστέθηκε"
        ) : (
          <>
            <span className="md:hidden">Προσθήκη</span>
            <span className="hidden md:inline">Προσθήκη στο καλάθι</span>
          </>
        )}
      </span>
    </button>
  );
}
