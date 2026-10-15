import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Ολοκλήρωση παραγγελίας",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-heading text-4xl tracking-tight md:text-6xl">
        Ολοκλήρωση παραγγελίας
      </h1>
      <CheckoutForm />
    </div>
  );
}
