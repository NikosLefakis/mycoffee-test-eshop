import type { Metadata } from "next";
import { Manrope, Noto_Serif_Display } from "next/font/google";
import { BRAND } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const body = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "greek"],
});

// High-contrast Didone with full Greek support; used light and large for headlines and the wordmark.
const heading = Noto_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin", "greek"],
  style: ["normal", "italic"],
});

// Subset of Material Symbols: only the icons listed in icon_names (must stay
// alphabetical). Keep in sync with IconName in components/icon.tsx.
const ICONS_CSS =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,300,0,0" +
  "&icon_names=add,arrow_back,check,close,favorite,menu,remove,schedule,shopping_bag,verified" +
  "&display=block";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  openGraph: {
    siteName: BRAND.name,
    locale: "el_GR",
    type: "website",
    // Dedicated 1200x630 crop under 300 KB: WhatsApp and Facebook skip bigger images.
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Ποτήρι με μαύρο καφέ και σκιά πάνω σε φωτεινή επιφάνεια",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="el"
      className={`${body.variable} ${heading.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={ICONS_CSS} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Μετάβαση στο περιεχόμενο
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
