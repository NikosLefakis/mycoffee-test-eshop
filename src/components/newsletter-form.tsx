"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/newsletter/actions";

const INITIAL: SubscribeState = { status: "idle" };

export function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, INITIAL);

  return (
    <form action={action} noValidate className="mx-auto mt-8 max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Το email σου"
          defaultValue={state.status === "error" ? state.email : ""}
          aria-invalid={state.status === "error" ? true : undefined}
          aria-describedby="newsletter-message"
          className="h-12 w-full min-w-0 border sm:w-auto sm:flex-1 border-border bg-card px-4 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 aria-[invalid=true]:border-destructive"
        />
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-12 bg-primary px-8 text-[0.72rem] font-medium tracking-[0.18em] text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {pending ? "Αποστολή…" : "Εγγραφή"}
        </button>
      </div>

      <div id="newsletter-message" className="mt-3 min-h-5 text-sm">
        {state.status === "success" && (
          <p role="status" className="text-foreground">
            Ευχαριστούμε! Η εγγραφή σου καταχωρίστηκε.
          </p>
        )}
        {state.status === "error" && (
          <p role="alert" className="text-destructive">
            {state.message}
          </p>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Εκπαιδευτικό demo: αποθηκεύουμε το email, αλλά δεν στέλνουμε πραγματικά
        μηνύματα.
      </p>
    </form>
  );
}
