"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitCheckout, type CheckoutState } from "@/app/checkout/actions";
import { ProductVisual } from "@/components/product-visual";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import {
  customerErrors,
  customerSchema,
  type CustomerField,
  type FieldErrors,
} from "@/lib/checkout-schema";
import { formatPrice } from "@/lib/format";
import { cn } from "cn";

const INITIAL: CheckoutState = { status: "idle" };

const SCENARIOS = [
  { value: "success", label: "Επιτυχής πληρωμή", hint: "Η παραγγελία ολοκληρώνεται και αποθηκεύεται." },
  { value: "declined", label: "Αποτυχημένη πληρωμή", hint: "Προσομοιώνει απόρριψη κάρτας. Δεν δημιουργείται παραγγελία." },
] as const;

type FieldDef = {
  name: CustomerField;
  label: string;
  type?: string;
  autoComplete: string;
  inputMode?: "text" | "tel" | "numeric" | "email";
  placeholder?: string;
};

const CONTACT_FIELDS: FieldDef[] = [
  { name: "name", label: "Ονοματεπώνυμο", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email" },
  { name: "phone", label: "Τηλέφωνο", type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "69XXXXXXXX" },
];

const ADDRESS_FIELDS: FieldDef[] = [
  { name: "address", label: "Διεύθυνση (οδός και αριθμός)", autoComplete: "street-address" },
  { name: "city", label: "Πόλη", autoComplete: "address-level2" },
  { name: "zip", label: "Τ.Κ.", autoComplete: "postal-code", inputMode: "numeric", placeholder: "12345" },
];

function Field({
  def,
  error,
  defaultValue,
}: {
  def: FieldDef;
  error?: string;
  defaultValue?: string;
}) {
  const id = `checkout-${def.name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm">
        {def.label}
      </label>
      <input
        id={id}
        name={def.name}
        type={def.type ?? "text"}
        inputMode={def.inputMode}
        autoComplete={def.autoComplete}
        placeholder={def.placeholder}
        defaultValue={defaultValue}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="h-11 w-full border border-border bg-card px-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

// One key per checkout session: a repeated submit returns the same order.
// Rendered only after the cart is ready, so it never runs during prerender.
function IdempotencyKeyInput() {
  const [key] = useState(() => crypto.randomUUID());
  return <input type="hidden" name="key" value={key} />;
}

export function CheckoutForm() {
  const { items, ready, subtotalCents } = useCart();
  const [state, formAction, pending] = useActionState(submitCheckout, INITIAL);
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);

  if (!ready) {
    return <p className="mt-10 text-muted-foreground">Φόρτωση…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-10">
        <p className="text-muted-foreground">
          Το καλάθι σου είναι άδειο, οπότε δεν υπάρχει κάτι να παραγγείλεις.
        </p>
        <Link
          href="/products"
          className={cn(buttonVariants({ size: "lg" }), "mt-6 h-12 rounded-none px-8")}
        >
          Δες τα προϊόντα
        </Link>
      </div>
    );
  }

  const serverErrors = state.status === "invalid" ? state.errors : {};
  const errors: FieldErrors = clientErrors ?? serverErrors;
  const values =
    state.status === "invalid" || state.status === "payment_failed"
      ? state.values
      : {};
  const cartPayload = JSON.stringify(
    items.map(({ productId, quantity }) => ({ productId, quantity })),
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = customerSchema.safeParse(data);
    if (!result.success) {
      e.preventDefault();
      setClientErrors(customerErrors(result.error));
      const first = Object.keys(customerErrors(result.error))[0];
      document.getElementById(`checkout-${first}`)?.focus();
    } else {
      setClientErrors(null);
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      noValidate
      className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_360px]"
    >
      <input type="hidden" name="cart" value={cartPayload} />
      <IdempotencyKeyInput />

      <div className="space-y-10">
        <fieldset className="min-w-0">
          <legend className="font-heading text-2xl">Στοιχεία επικοινωνίας</legend>
          <div className="mt-5 space-y-5">
            {CONTACT_FIELDS.map((def) => (
              <Field key={def.name} def={def} error={errors[def.name]} defaultValue={values[def.name]} />
            ))}
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="font-heading text-2xl">Διεύθυνση αποστολής</legend>
          <div className="mt-5 space-y-5">
            {ADDRESS_FIELDS.map((def) => (
              <Field key={def.name} def={def} error={errors[def.name]} defaultValue={values[def.name]} />
            ))}
            <div>
              <p className="mb-1.5 text-sm">Χώρα</p>
              <p className="flex h-11 items-center border border-border bg-muted px-3 text-sm text-muted-foreground">
                Ελλάδα
              </p>
            </div>
          </div>
        </fieldset>

        <fieldset className="min-w-0">
          <legend className="font-heading text-2xl">Πληρωμή</legend>
          <p className="mt-3 border border-border bg-card p-4 text-sm leading-relaxed text-muted-foreground">
            Αυτή είναι προσομοίωση. Δεν ζητάμε και δεν αποθηκεύουμε στοιχεία
            κάρτας, και δεν γίνεται καμία χρέωση. Διάλεξε το αποτέλεσμα που
            θέλεις να δοκιμάσεις.
          </p>
          <div className="mt-5 space-y-3">
            {SCENARIOS.map((sc) => (
              <label
                key={sc.value}
                className="flex cursor-pointer items-start gap-3 border border-border bg-card p-4 transition-colors has-checked:border-primary"
              >
                <input
                  type="radio"
                  name="scenario"
                  value={sc.value}
                  defaultChecked={sc.value === "success"}
                  className="mt-1 accent-primary"
                />
                <span>
                  <span className="block text-sm font-medium">{sc.label}</span>
                  <span className="block text-xs text-muted-foreground">{sc.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="h-fit bg-secondary/60 p-7">
        <h2 className="font-heading text-2xl">Η παραγγελία σου</h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-secondary">
                <ProductVisual slug={item.slug} name={item.name} sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">Ποσότητα: {item.quantity}</p>
              </div>
              <p className="text-sm tabular-nums">{formatPrice(item.priceCents * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
          <div className="flex justify-between">
            <dt>Υποσύνολο</dt>
            <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Μεταφορικά</dt>
            <dd>Δωρεάν</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium">
            <dt>Σύνολο</dt>
            <dd className="tabular-nums">{formatPrice(subtotalCents)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-muted-foreground">
          Η τελική τιμή επιβεβαιώνεται από τον server κατά την παραγγελία.
        </p>

        {state.status === "invalid" && state.formError && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {state.formError}
          </p>
        )}
        {state.status === "payment_failed" && (
          <p role="alert" className="mt-4 border border-destructive/40 bg-card p-3 text-sm text-destructive">
            {state.message}
          </p>
        )}

        <Button type="submit" size="lg" disabled={pending} className="mt-6 h-12 w-full rounded-none">
          {pending ? "Επεξεργασία πληρωμής…" : "Πληρωμή και ολοκλήρωση"}
        </Button>
      </aside>
    </form>
  );
}
