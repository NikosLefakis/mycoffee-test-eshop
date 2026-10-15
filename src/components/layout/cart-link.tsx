"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { useCart } from "@/lib/cart-store";

export function CartLink() {
  const { count, ready } = useCart();
  const shown = ready && count > 0;

  return (
    <Link
      href="/cart"
      aria-label={
        shown
          ? `Καλάθι, ${count} ${count === 1 ? "προϊόν" : "προϊόντα"}`
          : "Καλάθι"
      }
      className="relative grid size-11 place-items-center"
    >
      <Icon name="shopping_bag" className="text-[26px]" />
      {shown && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-0 grid min-w-[18px] place-items-center rounded-full bg-amber px-1 text-[10px] leading-[18px] font-semibold text-primary tabular-nums"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
