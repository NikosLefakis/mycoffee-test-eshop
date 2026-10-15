import Link from "next/link";
import { CartLink } from "@/components/layout/cart-link";
import { MobileNav, type NavLink } from "@/components/layout/mobile-nav";
import { Logo } from "@/components/logo";

export const NAV_LINKS: NavLink[] = [
  { href: "/products", label: "Κατάστημα" },
  { href: "/products?category=beans", label: "Κόκκοι καφέ" },
  { href: "/products?category=equipment", label: "Εξοπλισμός" },
  { href: "/products?category=cups", label: "Κούπες" },
  { href: "/about", label: "Η ιστορία μας" },
];

// Layout by width: below lg a hamburger; at lg the nav sits right next to the
// cart (logo column is `auto`, so the two can never overlap); from xl the nav
// is centred between the logo and the cart.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center px-5 md:h-20 md:px-8 lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="justify-self-start text-[0.8rem] md:text-[1rem]">
          <Logo />
        </Link>

        <nav
          aria-label="Κύρια πλοήγηση"
          className="hidden items-center gap-7 lg:mr-6 lg:flex lg:justify-self-end xl:mr-0 xl:justify-self-center xl:gap-9"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.72rem] font-medium tracking-[0.18em] whitespace-nowrap text-foreground/75 uppercase transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end">
          <CartLink />
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
