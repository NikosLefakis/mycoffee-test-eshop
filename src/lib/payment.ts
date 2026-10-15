import type { PaymentScenario } from "@/lib/checkout-schema";

export type PaymentResult = { ok: true } | { ok: false; message: string };

// Stand-in for a real payment provider. A real integration (e.g. Stripe) would
// create a payment intent for the server-computed total and confirm it there.
export async function simulatePayment(
  scenario: PaymentScenario,
): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (scenario === "declined") {
    return {
      ok: false,
      message:
        "Η πληρωμή απορρίφθηκε (προσομοίωση). Δεν έγινε καμία χρέωση. Δοκίμασε ξανά ή επίλεξε «Επιτυχής πληρωμή».",
    };
  }
  return { ok: true };
}
