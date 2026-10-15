import Link from "next/link";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center md:px-8 md:py-36">
      <p className="font-heading text-7xl text-muted-foreground/60">404</p>
      <h1 className="font-heading mt-6 text-4xl tracking-tight md:text-5xl">
        Η σελίδα δεν βρέθηκε
      </h1>
      <p className="mx-auto mt-5 max-w-md text-muted-foreground">
        Ο σύνδεσμος μπορεί να είναι λάθος ή το προϊόν να μην υπάρχει πια.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/products"
          className={cn(buttonVariants({ size: "lg" }), "h-12 rounded-none px-9")}
        >
          Δες τα προϊόντα
        </Link>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 rounded-none border-primary bg-transparent px-9 hover:bg-primary hover:text-primary-foreground",
          )}
        >
          Αρχική σελίδα
        </Link>
      </div>
    </div>
  );
}
