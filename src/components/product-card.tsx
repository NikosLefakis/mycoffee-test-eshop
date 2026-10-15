import Link from "next/link";
import { ProductVisual } from "@/components/product-visual";
import { QuickAdd } from "@/components/quick-add";
import { CATEGORY_LABELS, formatPrice } from "@/lib/format";
import { PRODUCT_BADGES } from "@/lib/photos";
import type { Product } from "@/lib/products";

export function ProductCard({
  product,
  as: Heading = "h3",
}: {
  product: Product;
  as?: "h2" | "h3";
}) {
  const badge = PRODUCT_BADGES[product.slug];
  const href = `/products/${product.slug}`;

  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Link href={href} aria-label={product.name} className="absolute inset-0 block">
          <ProductVisual
            slug={product.slug}
            name={product.name}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>
        {badge && (
          <span className="pointer-events-none absolute top-3 left-3 bg-amber px-2.5 py-1 text-[0.65rem] font-semibold tracking-[0.12em] text-primary uppercase">
            {badge}
          </span>
        )}
        {product.in_stock && (
          <div className="absolute inset-x-0 bottom-0 transition-transform duration-300 md:translate-y-full md:group-focus-within:translate-y-0 md:group-hover:translate-y-0">
            <QuickAdd
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.price_cents,
              }}
            />
          </div>
        )}
      </div>

      <Link href={href} className="mt-4 block">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <Heading className="font-heading min-w-0 text-lg leading-snug break-words text-balance">
            {product.name}
          </Heading>
          <p className="shrink-0 text-[0.95rem] tabular-nums">
            {formatPrice(product.price_cents)}
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </p>
      </Link>
    </article>
  );
}
