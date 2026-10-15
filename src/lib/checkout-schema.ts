import { z } from "zod";

export const MAX_ITEM_QUANTITY = 10;

// Greek mobile (69xxxxxxxx) or landline (2xxxxxxxxx), optional +30 / 0030.
const GREEK_PHONE = /^(?:\+30|0030)?(?:69\d{8}|2\d{9})$/;

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : v);

export const customerSchema = z.object({
  name: z.preprocess(
    clean,
    z
      .string({ error: "Συμπλήρωσε το ονοματεπώνυμό σου." })
      .min(1, "Συμπλήρωσε το ονοματεπώνυμό σου.")
      .min(3, "Το ονοματεπώνυμο πρέπει να έχει τουλάχιστον 3 χαρακτήρες.")
      .max(100, "Το ονοματεπώνυμο είναι πολύ μεγάλο."),
  ),
  email: z.preprocess(
    clean,
    z
      .string({ error: "Συμπλήρωσε το email σου." })
      .min(1, "Συμπλήρωσε το email σου.")
      .max(254, "Το email είναι πολύ μεγάλο.")
      .pipe(z.email("Το email δεν είναι έγκυρο.")),
  ),
  phone: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/[\s-]/g, "") : v),
    z
      .string({ error: "Συμπλήρωσε το τηλέφωνό σου." })
      .min(1, "Συμπλήρωσε το τηλέφωνό σου.")
      .regex(
        GREEK_PHONE,
        "Δώσε έγκυρο ελληνικό τηλέφωνο (π.χ. 6912345678 ή 2101234567).",
      ),
  ),
  address: z.preprocess(
    clean,
    z
      .string({ error: "Συμπλήρωσε τη διεύθυνσή σου." })
      .min(1, "Συμπλήρωσε τη διεύθυνσή σου.")
      .min(5, "Η διεύθυνση πρέπει να έχει τουλάχιστον 5 χαρακτήρες.")
      .max(150, "Η διεύθυνση είναι πολύ μεγάλη."),
  ),
  city: z.preprocess(
    clean,
    z
      .string({ error: "Συμπλήρωσε την πόλη σου." })
      .min(1, "Συμπλήρωσε την πόλη σου.")
      .min(2, "Η πόλη πρέπει να έχει τουλάχιστον 2 χαρακτήρες.")
      .max(80, "Η πόλη είναι πολύ μεγάλη."),
  ),
  zip: z.preprocess(
    (v) => (typeof v === "string" ? v.replace(/\s/g, "") : v),
    z
      .string({ error: "Συμπλήρωσε τον ταχυδρομικό κώδικα." })
      .min(1, "Συμπλήρωσε τον ταχυδρομικό κώδικα.")
      .regex(/^\d{5}$/, "Ο ταχυδρομικός κώδικας έχει 5 ψηφία."),
  ),
});

// The cart sent by the browser is only ever an intent: ids and quantities.
// Prices and availability are looked up on the server when the order is placed.
export const cartSchema = z
  .array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().min(1).max(MAX_ITEM_QUANTITY),
    }),
  )
  .min(1, "Το καλάθι σου είναι άδειο.")
  .max(50, "Πάρα πολλά προϊόντα στο καλάθι.");

export type CustomerInput = z.input<typeof customerSchema>;
export type CustomerData = z.output<typeof customerSchema>;
export type CustomerField = keyof CustomerInput;
export type FieldErrors = Partial<Record<CustomerField, string>>;

export function customerErrors(error: z.ZodError): FieldErrors {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[]>;
  const out: FieldErrors = {};
  for (const [key, messages] of Object.entries(flat)) {
    if (messages?.[0]) out[key as CustomerField] = messages[0];
  }
  return out;
}

// Simulated payment: the shopper picks the outcome, like a payment provider's
// test cards. No card data is ever requested or stored.
export const paymentScenarioSchema = z.enum(["success", "declined"]);
export type PaymentScenario = z.infer<typeof paymentScenarioSchema>;

// One key per checkout session; a repeated submit returns the same order.
export const idempotencyKeySchema = z.uuid();

export const emailSchema = z.preprocess(
  (v) => (typeof v === "string" ? v.trim().toLowerCase() : v),
  z
    .string({ error: "Συμπλήρωσε το email σου." })
    .min(1, "Συμπλήρωσε το email σου.")
    .max(254, "Το email είναι πολύ μεγάλο.")
    .pipe(z.email("Το email δεν είναι έγκυρο.")),
);
