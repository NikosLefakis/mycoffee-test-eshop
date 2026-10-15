"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-store";

// The order is stored, so the browser cart is no longer needed.
export function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
