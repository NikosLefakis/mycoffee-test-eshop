"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";

export type NavLink = { href: string; label: string };

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="grid size-11 place-items-center"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} className="text-[26px]" />
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Μενού"
          className="absolute inset-x-0 top-full border-b border-border bg-background px-5 pt-2 pb-5 shadow-sm md:px-8"
        >
          <ul className="divide-y divide-border">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-4 text-[0.8rem] font-medium tracking-[0.18em] uppercase"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
