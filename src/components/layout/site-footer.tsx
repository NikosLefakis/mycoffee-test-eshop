import Link from "next/link";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { BRAND } from "@/lib/brand";

const SHOP = [
  { href: "/products", label: "Όλα τα προϊόντα" },
  { href: "/products?category=beans", label: "Κόκκοι καφέ" },
  { href: "/products?category=equipment", label: "Εξοπλισμός" },
  { href: "/products?category=cups", label: "Κούπες" },
];

const ABOUT = [
  { href: "/about", label: "Η ιστορία μας" },
  { href: "/cart", label: "Καλάθι" },
];

function LinkList({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <nav aria-label={title}>
      <p className="text-sm text-primary-foreground/60">{title}</p>
      <ul className="mt-5 space-y-3 text-[0.95rem]">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-primary-foreground/85 transition-colors hover:text-primary-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <>
    <section className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-5 py-16 text-center md:px-8 md:py-24">
        <h2 className="font-heading text-4xl tracking-tight md:text-5xl">
          Μείνε σε επαφή
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Εγγράψου για να μαθαίνεις πρώτος για νέους καφέδες, ψησίματα και
          συνταγές.
        </p>
        <NewsletterForm />
      </div>
    </section>
    <footer className="bg-[#0a172b] text-primary-foreground">
      <div className="mx-auto max-w-6xl px-5 pt-16 md:px-8 md:pt-24">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-10">
          <div>
            <Logo className="text-xl" />
            <p className="font-heading mt-6 max-w-[16rem] text-2xl leading-snug text-primary-foreground/90">
              {BRAND.tagline}
            </p>
          </div>

          <LinkList title="Κατάστημα" links={SHOP} />
          <LinkList title={BRAND.name} links={ABOUT} />
        </div>

        <div className="mt-16 h-px bg-amber/70" />

        <div className="flex flex-col gap-2 py-8 text-sm text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {BRAND.name}. Ηράκλειο, Κρήτη.</p>
          <p>
            Created by{" "}
            <a
              href="https://smartwaves.gr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-foreground/85 underline underline-offset-4 transition-colors hover:text-primary-foreground"
            >
              SmartwavesGR
            </a>
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
