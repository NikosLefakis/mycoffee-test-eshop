import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "cn";
import { Emblem } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Η ιστορία μας",
  description:
    "Από πού ξεκινά ο καφές μας, πώς τον ψήνουμε και τι δεν κάνουμε ποτέ.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-24">
      <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="font-heading text-5xl leading-[1.04] tracking-tight text-balance md:text-7xl">
            Από τον σπόρο.
          </h1>

          <div className="mt-10 max-w-xl space-y-10 text-lg leading-relaxed">
            <section>
              <h2 className="font-heading text-3xl">Ο σπόρος</h2>
              <p className="mt-3 text-muted-foreground">
                Ο κόκκος του καφέ είναι ένας σπόρος: ένα μικρό φρούτο που έχει
                μέσα του όλη τη γεύση. Δουλεύουμε με αυτή την ιδέα. Λιγότερες
                παρεμβάσεις, περισσότερος σεβασμός στο υλικό.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-3xl">Πώς ψήνουμε</h2>
              <p className="mt-3 text-muted-foreground">
                Ψήνουμε μικρές παρτίδες κάθε εβδομάδα και γράφουμε στην
                ετικέτα την ημερομηνία ψησίματος, τον παραγωγό και το
                υψόμετρο. Αν ένας καφές δεν είναι στα καλύτερά του, δεν τον
                πουλάμε.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-3xl">Τι δεν κάνουμε</h2>
              <p className="mt-3 text-muted-foreground">
                Δεν ψήνουμε σκούρα για να κρύψουμε ατέλειες και δεν προσθέτουμε
                αρώματα. Ο καφές πρέπει να έχει τη γεύση του καφέ.
              </p>
            </section>
          </div>

          <Link
            href="/products?category=beans"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-12 h-13 rounded-none px-10 text-[0.95rem]",
            )}
          >
            Δες τον καφέ
          </Link>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Το {BRAND.name} είναι φανταστικό brand, φτιαγμένο για
            εκπαιδευτικούς σκοπούς.
          </p>
        </div>

        <div className="mx-auto grid aspect-[4/5] w-full max-w-sm place-items-center bg-secondary">
          <Emblem className="h-3/5 w-auto text-primary" />
        </div>
      </div>
    </div>
  );
}
