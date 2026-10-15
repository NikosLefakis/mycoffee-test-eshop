import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { Icon } from "@/components/icon";
import { ProductVisual } from "@/components/product-visual";
import { BRAND } from "@/lib/brand";
import { CATEGORY_LABELS, formatPrice } from "@/lib/format";
import { PRODUCT_PHOTOS } from "@/lib/photos";
import { getProductBySlug, getProducts, type Product } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const photo = PRODUCT_PHOTOS[product.slug];
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      // 1200x630 share card per product (public/og), small enough for WhatsApp.
      images: photo
        ? [{ url: `/og/${product.slug}.jpg`, width: 1200, height: 630, alt: product.name }]
        : undefined,
    },
  };
}

function ProductDetail({ product }: { product: Product }) {
  const photo = PRODUCT_PHOTOS[product.slug];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: photo ? [`${SITE_URL}${photo}`] : undefined,
    category: CATEGORY_LABELS[product.category] ?? product.category,
    brand: { "@type": "Brand", name: BRAND.name },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: "EUR",
      price: (product.price_cents / 100).toFixed(2),
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
      <div className="aspect-[4/5] overflow-hidden bg-secondary md:sticky md:top-28 md:self-start">
        <ProductVisual
          slug={product.slug}
          name={product.name}
          sizes="(min-width: 768px) 50vw, 100vw"
          priority
        />
      </div>

      <div className="md:pt-4">
        <p className="text-sm text-muted-foreground">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </p>
        <h1 className="font-heading mt-3 text-4xl leading-[1.1] tracking-tight text-balance md:text-5xl">
          {product.name}
        </h1>
        <p className="mt-6 text-2xl tabular-nums">
          {formatPrice(product.price_cents)}
        </p>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <p className="mt-8 flex items-center gap-2 text-sm">
          <span
            className={`size-2 rounded-full ${product.in_stock ? "bg-amber" : "bg-destructive"}`}
            aria-hidden="true"
          />
          {product.in_stock ? "Διαθέσιμο" : "Εξαντλημένο"}
        </p>
        <AddToCartButton
          inStock={product.in_stock}
          product={{
            productId: product.id,
            slug: product.slug,
            name: product.name,
            priceCents: product.price_cents,
          }}
        />
        <p className="mt-6 text-sm text-muted-foreground">
          Demo κατάστημα: δεν γίνονται πραγματικές χρεώσεις.
        </p>
      </div>
    </div>
    </>
  );
}

// Resolved before anything streams, so an unknown slug is a real HTTP 404.
export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        Όλα τα προϊόντα
      </Link>
      <div className="mt-8">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
