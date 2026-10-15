"use server";

import { redirect } from "next/navigation";
import {
  cartSchema,
  customerErrors,
  customerSchema,
  idempotencyKeySchema,
  MAX_ITEM_QUANTITY,
  paymentScenarioSchema,
  type FieldErrors,
} from "@/lib/checkout-schema";
import { createOrder, type OrderLine } from "@/lib/orders";
import { simulatePayment } from "@/lib/payment";
import { getProductsByIds } from "@/lib/products";

export type CheckoutState =
  | { status: "idle" }
  | {
      status: "invalid";
      errors: FieldErrors;
      formError?: string;
      values: Record<string, string>;
    }
  | { status: "payment_failed"; message: string; values: Record<string, string> };

const FIELDS = ["name", "email", "phone", "address", "city", "zip"] as const;

function invalid(
  values: Record<string, string>,
  formError: string,
  errors: FieldErrors = {},
): CheckoutState {
  return { status: "invalid", errors, formError, values };
}

export async function submitCheckout(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const values: Record<string, string> = {};
  for (const field of FIELDS) {
    const v = formData.get(field);
    values[field] = typeof v === "string" ? v : "";
  }

  // 1. Validate everything the browser sent.
  const customer = customerSchema.safeParse(values);

  let formError: string | undefined;
  let rawCart: unknown = null;
  try {
    rawCart = JSON.parse(String(formData.get("cart") ?? "null"));
  } catch {
    formError = "Δεν ήταν δυνατή η ανάγνωση του καλαθιού.";
  }
  const cart = cartSchema.safeParse(rawCart);
  if (!cart.success && !formError) {
    const issue = cart.error.issues[0];
    // Array-level issues (empty / too many) carry our Greek message; issues on
    // an item (bad id or quantity) mean the cart was tampered with or is stale.
    formError =
      issue && issue.path.length === 0
        ? issue.message
        : "Το καλάθι περιέχει μη έγκυρα προϊόντα ή ποσότητες. Ανανέωσέ το και δοκίμασε ξανά.";
  }

  const scenario = paymentScenarioSchema.safeParse(formData.get("scenario"));
  const key = idempotencyKeySchema.safeParse(formData.get("key"));
  if (!formError && (!scenario.success || !key.success)) {
    formError = "Η φόρμα δεν είναι έγκυρη. Ανανέωσε τη σελίδα και δοκίμασε ξανά.";
  }

  if (!customer.success || formError || !cart.success || !scenario.success || !key.success) {
    return {
      status: "invalid",
      errors: customer.success ? {} : customerErrors(customer.error),
      formError,
      values,
    };
  }

  // 2. Never trust prices from the browser: merge duplicate lines, then look
  //    up every product in the database and re-price the order from there.
  const quantities = new Map<number, number>();
  for (const item of cart.data) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  const products = await getProductsByIds([...quantities.keys()]);
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines: OrderLine[] = [];

  for (const [productId, quantity] of quantities) {
    const product = byId.get(productId);
    if (!product) {
      return invalid(values, "Ένα προϊόν του καλαθιού δεν υπάρχει πια. Αφαίρεσέ το και δοκίμασε ξανά.");
    }
    if (!product.in_stock) {
      return invalid(values, `Το προϊόν «${product.name}» δεν είναι πλέον διαθέσιμο. Αφαίρεσέ το από το καλάθι.`);
    }
    if (quantity > MAX_ITEM_QUANTITY) {
      return invalid(values, `Μπορείς να παραγγείλεις έως ${MAX_ITEM_QUANTITY} τεμάχια ανά προϊόν.`);
    }
    lines.push({
      productId,
      name: product.name,
      unitPriceCents: product.price_cents,
      quantity,
    });
  }

  // 3. Simulated payment. No order exists until it succeeds.
  const payment = await simulatePayment(scenario.data);
  if (!payment.ok) {
    return { status: "payment_failed", message: payment.message, values };
  }

  // 4. Store the order (idempotent per checkout session).
  let publicId: string;
  try {
    ({ publicId } = await createOrder({
      idempotencyKey: key.data,
      customer: customer.data,
      lines,
    }));
  } catch (error) {
    console.error("createOrder failed:", error instanceof Error ? error.message : error);
    return invalid(values, "Δεν ήταν δυνατή η καταχώριση της παραγγελίας. Δεν έγινε χρέωση. Δοκίμασε ξανά σε λίγο.");
  }

  redirect(`/order/${publicId}`);
}
