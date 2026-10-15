import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cn } from "cn";
import { ClearCart } from "@/components/clear-cart";
import { Icon } from "@/components/icon";
import { ProductVisual } from "@/components/product-visual";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getOrderByPublicId } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Επιβεβαίωση παραγγελίας",
  robots: { index: false, follow: false },
};

async function OrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderByPublicId(id);
  if (!order) notFound();

  const firstName = order.customerName.split(" ")[0];
  const orderNumber = order.publicId.slice(0, 8).toUpperCase();
  const date = new Intl.DateTimeFormat("el-GR", {
    dateStyle: "long",
    timeStyle: "short",
    hour12: false,
    timeZone: "Europe/Athens",
  }).format(order.createdAt);

  return (
    <>
      <ClearCart />
      <div className="flex items-start gap-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Icon name="check" className="text-[26px]" />
        </span>
        <div>
          <h1 className="font-heading text-4xl leading-tight tracking-tight text-balance md:text-5xl">
            Ευχαριστούμε, {firstName}.
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted-foreground">
            Η παραγγελία σου καταχωρίστηκε. Αριθμός παραγγελίας{" "}
            <span className="font-medium text-foreground">#{orderNumber}</span>{" "}
            ({date}).
          </p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Αυτό είναι εκπαιδευτικό demo: η πληρωμή ήταν προσομοίωση, δεν έγινε
            χρέωση και δεν στέλνονται emails.
          </p>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_340px]">
        <ul className="divide-y divide-border border-y border-border">
          {order.items.map((item) => (
            <li key={item.productName} className="flex gap-5 py-6">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-secondary">
                {item.slug && (
                  <ProductVisual slug={item.slug} name={item.productName} sizes="96px" />
                )}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-4">
                  <p className="text-sm font-medium">{item.productName}</p>
                  <p className="text-sm tabular-nums">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × {formatPrice(item.unitPriceCents)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-8 bg-secondary/60 p-7">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt>Υποσύνολο</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Μεταφορικά</dt>
              <dd>{order.shippingCents === 0 ? "Δωρεάν" : formatPrice(order.shippingCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-medium">
              <dt>Σύνολο</dt>
              <dd className="tabular-nums">{formatPrice(order.totalCents)}</dd>
            </div>
          </dl>

          <div className="text-sm">
            <p className="font-heading text-xl">Αποστολή σε</p>
            <address className="mt-3 leading-relaxed text-muted-foreground not-italic">
              {order.customerName}
              <br />
              {order.shippingAddress}
              <br />
              {order.shippingZip} {order.shippingCity}
              <br />
              Ελλάδα
            </address>
          </div>

          <p className="text-sm text-muted-foreground">
            Πληρωμή: προσομοίωση, επιτυχής.
          </p>
        </aside>
      </div>

      <Link
        href="/products"
        className={cn(buttonVariants({ size: "lg" }), "mt-14 h-12 rounded-none px-10")}
      >
        Συνέχισε τις αγορές
      </Link>
    </>
  );
}

export default function OrderPage({ params }: PageProps<"/order/[id]">) {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <Suspense fallback={<p className="text-muted-foreground">Φόρτωση…</p>}>
        <OrderDetails params={params} />
      </Suspense>
    </div>
  );
}
