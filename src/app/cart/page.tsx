import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Καλάθι",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-heading text-5xl tracking-tight md:text-6xl">Καλάθι</h1>
      <CartView />
    </div>
  );
}
