"use server";

import { emailSchema } from "@/lib/checkout-schema";
import { pool } from "@/lib/db";

export type SubscribeState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; email: string };

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success" };
  }

  const raw = String(formData.get("email") ?? "");
  const parsed = emailSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Το email δεν είναι έγκυρο.",
      email: raw,
    };
  }

  try {
    // A repeat sign-up succeeds silently, so the form never reveals who is subscribed.
    await pool.query(
      "INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
      [parsed.data],
    );
  } catch (error) {
    console.error("subscribe failed:", error instanceof Error ? error.message : error);
    return {
      status: "error",
      message: "Δεν ήταν δυνατή η εγγραφή. Δοκίμασε ξανά σε λίγο.",
      email: raw,
    };
  }

  return { status: "success" };
}
