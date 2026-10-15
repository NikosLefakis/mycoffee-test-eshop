"use client";

import { useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { addToCart, type CartItem } from "@/lib/cart-store";

export function AddToCartButton({
  product,
  inStock,
}: {
  product: Omit<CartItem, "quantity">;
  inStock: boolean;
}) {
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <Button size="lg" disabled className="mt-8 h-12 w-full rounded-none sm:w-auto sm:px-10">
        Εξαντλημένο
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="mt-8 h-12 w-full rounded-none sm:w-auto sm:px-10"
      onClick={() => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
      }}
    >
      <Icon name={added ? "check" : "shopping_bag"} className="text-[20px]" />
      <span aria-live="polite">
        {added ? "Προστέθηκε στο καλάθι" : "Προσθήκη στο καλάθι"}
      </span>
    </Button>
  );
}
