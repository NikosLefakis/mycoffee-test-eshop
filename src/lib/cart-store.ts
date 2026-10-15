"use client";

import { useSyncExternalStore } from "react";
import { MAX_ITEM_QUANTITY } from "./checkout-schema";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export const MAX_QUANTITY = MAX_ITEM_QUANTITY;

const STORAGE_KEY = "sporos-cart";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Number.isInteger(v.productId) &&
    typeof v.slug === "string" &&
    typeof v.name === "string" &&
    Number.isInteger(v.priceCents) &&
    Number.isInteger(v.quantity) &&
    (v.quantity as number) > 0
  );
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    items = Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    items = EMPTY;
  }
}

function commit(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable (private mode / quota): cart still works in memory.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

const subscribeNoop = () => () => {};

export function addToCart(product: Omit<CartItem, "quantity">) {
  load();
  const existing = items.find((i) => i.productId === product.productId);
  if (existing) {
    commit(
      items.map((i) =>
        i.productId === product.productId
          ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) }
          : i,
      ),
    );
  } else {
    commit([...items, { ...product, quantity: 1 }]);
  }
}

export function setQuantity(productId: number, quantity: number) {
  load();
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const capped = Math.min(quantity, MAX_QUANTITY);
  commit(
    items.map((i) =>
      i.productId === productId ? { ...i, quantity: capped } : i,
    ),
  );
}

export function removeFromCart(productId: number) {
  load();
  commit(items.filter((i) => i.productId !== productId));
}

export function clearCart() {
  commit(EMPTY);
}

export function useCart() {
  const cartItems = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const subtotalCents = cartItems.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0,
  );
  return { items: cartItems, ready, count, subtotalCents };
}
