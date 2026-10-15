import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { getProducts } from "@/lib/products";

const CATEGORIES = [
  { value: undefined, label: "Όλα" },
  { value: "beans", label: "Κόκκοι καφέ" },
  { value: "equipment", label: "Εξοπλισμός" },
  { value: "cups", label: "Κούπες" },
];

async function ProductGrid({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts(category);

  return (
    <>
      <nav
        aria-label="Κατηγορίες"
        className="mt-10 flex gap-x-7 gap-y-2 overflow-x-auto overflow-y-hidden border-b border-border text-[0.95rem]"
      >
        {CATEGORIES.map((c) => {
          const active = c.value === category || (!c.value && !category);
          return (
            <Link
              key={c.label}
              href={c.value ? `/products?category=${c.value}` : "/products"}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "-mb-px border-b border-amber pb-3 whitespace-nowrap"
                  : "pb-3 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
              }
            >
              {c.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-6 lg:grid-cols-3 lg:gap-y-16">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} as="h2" />
        ))}
      </div>
      {products.length === 0 && (
        <p className="mt-12 text-muted-foreground">
          Δεν βρέθηκαν προϊόντα σε αυτή την κατηγορία.{" "}
          <Link href="/products" className="underline underline-offset-4">
            Δες όλα τα προϊόντα
          </Link>
        </p>
      )}
    </>
  );
}

export default function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <h1 className="font-heading text-5xl tracking-tight md:text-6xl">
        Καφές και εξοπλισμός
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Κόκκοι ψημένοι σε μικρές παρτίδες και ό,τι χρειάζεσαι για να τους φτιάξεις σωστά.
      </p>
      <Suspense fallback={<p className="mt-10 text-muted-foreground">Φόρτωση…</p>}>
        <ProductGrid searchParams={searchParams as Promise<{ category?: string }>} />
      </Suspense>
    </div>
  );
}
