"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8 md:py-36">
      <h1 className="font-heading text-4xl tracking-tight md:text-5xl">
        Κάτι πήγε στραβά
      </h1>
      <p className="mx-auto mt-5 max-w-md text-muted-foreground">
        Δεν ήταν δυνατή η φόρτωση της σελίδας. Δοκίμασε ξανά σε λίγο. Αν το
        πρόβλημα συνεχιστεί, το καλάθι σου παραμένει αποθηκευμένο.
      </p>
      <Button
        size="lg"
        className="mt-10 h-12 rounded-none px-9"
        onClick={() => retry()}
      >
        Δοκίμασε ξανά
      </Button>
    </div>
  );
}
