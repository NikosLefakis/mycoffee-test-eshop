import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "cn";
import { Icon, type IconName } from "@/components/icon";
import { ProductCard } from "@/components/product-card";
import { buttonVariants } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";
import { CATEGORY_LABELS } from "@/lib/format";
import {
  COLLECTION_PHOTOS,
  HERO_PHOTO,
  photoUrl,
  STORY_PHOTO,
} from "@/lib/photos";
import { getProducts } from "@/lib/products";

const FEATURED_SLUGS = [
  "ethiopia-guji",
  "house-espresso-blend",
  "copper-briki",
  "hand-grinder",
];

const STORY_POINTS: { icon: IconName; title: string; body: string }[] = [
  { icon: "verified", title: "Ποιότητα", body: "Ειδικός καφές, επιλεγμένος κόκκος" },
  { icon: "favorite", title: "Πάθος", body: "Μικρές παρτίδες, κάθε εβδομάδα" },
  { icon: "schedule", title: "Υπομονή", body: "Αργό ψήσιμο, χωρίς συντομεύσεις" },
];

const COLLECTIONS = [
  { key: "beans", sub: "Ψημένοι σε μικρές παρτίδες" },
  { key: "equipment", sub: "Για κάθε μέθοδο παρασκευής" },
  { key: "cups", sub: "Για κάθε φλιτζάνι" },
] as const;

const GUIDES = [
  {
    title: "Φίλτρο",
    specs: [
      ["Αναλογία", "15 γρ. καφέ ανά 250 ml νερό"],
      ["Θερμοκρασία", "93 έως 96 °C"],
      ["Χρόνος", "περίπου 3 λεπτά"],
      ["Άλεση", "μεσαία"],
    ],
  },
  {
    title: "Espresso",
    specs: [
      ["Αναλογία", "18 γρ. καφέ, 36 γρ. στο φλιτζάνι"],
      ["Θερμοκρασία", "92 έως 94 °C"],
      ["Χρόνος", "25 έως 30 δευτερόλεπτα"],
      ["Άλεση", "λεπτή"],
    ],
  },
  {
    title: "Ελληνικός",
    specs: [
      ["Αναλογία", "1 κουταλάκι ανά φλιτζάνι"],
      ["Θερμοκρασία", "χαμηλή φωτιά"],
      ["Χρόνος", "2 έως 3 λεπτά, ως να ανέβει το καϊμάκι"],
      ["Άλεση", "σκόνη"],
    ],
  },
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "flex items-center gap-4 text-[0.72rem] font-medium tracking-[0.25em] uppercase",
        light ? "text-primary-foreground/70" : "text-muted-foreground",
      )}
    >
      <span className="h-px w-10 bg-amber" />
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={cn(
          "text-[0.72rem] font-medium tracking-[0.25em] uppercase",
          light ? "text-primary-foreground/70" : "text-muted-foreground",
        )}
      >
        {eyebrow}
      </p>
      <h2 className="font-heading mt-4 text-4xl tracking-tight md:text-5xl">
        {title}
      </h2>
    </div>
  );
}

async function CatalogSections() {
  const products = await getProducts();
  const count = (c: string) => products.filter((p) => p.category === c).length;
  const featured = FEATURED_SLUGS.map((s) =>
    products.find((p) => p.slug === s),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  const stats = [
    { n: count("beans"), label: "ποικιλίες καφέ" },
    { n: count("equipment"), label: "εργαλεία παρασκευής" },
    { n: count("cups"), label: "κούπες και φλιτζάνια" },
  ];

  return (
    <>
      <section className="border-b border-border bg-background">
        <dl className="mx-auto grid max-w-6xl grid-cols-3 px-5 py-10 text-center md:px-8 md:py-14">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="font-heading text-4xl md:text-6xl">{s.n}</dt>
              <dd className="mt-2 text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase md:text-xs">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-secondary/50">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="Επιλεγμένα" title="Οι αγαπημένες μας" />
          <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-none border-primary bg-transparent px-9 text-[0.72rem] font-medium tracking-[0.18em] uppercase hover:bg-primary hover:text-primary-foreground",
              )}
            >
              Δες όλα τα προϊόντα
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <div>
      <section className="relative isolate flex min-h-[34rem] items-center overflow-hidden md:min-h-[calc(100svh-7rem)]">
        <Image
          src={photoUrl(HERO_PHOTO)}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[72%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-b from-background/95 via-background/80 to-background/35 md:bg-linear-to-r md:from-background md:via-background/80 md:to-background/5"
        />
        <div className="mx-auto w-full max-w-7xl px-5 py-20 md:px-8">
          <div className="max-w-xl">
            <Eyebrow>Ειδικός καφές σε μικρές παρτίδες</Eyebrow>
            <h1 className="font-heading mt-7 text-[clamp(2.75rem,6.4vw,5.2rem)] leading-[1.04] tracking-tight text-balance">
              Από τον σπόρο
              <br />
              στο <em className="italic">φλιτζάνι</em>.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-foreground/75">
              Επιλεγμένοι κόκκοι από μικρούς παραγωγούς, και ό,τι χρειάζεσαι
              για να τους φτιάξεις σωστά στο σπίτι.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products?category=beans"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-sm px-8 text-[0.72rem] font-medium tracking-[0.18em] uppercase",
                )}
              >
                Δες τον καφέ
              </Link>
              <Link
                href="/products?category=equipment"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-sm border-primary bg-background/60 px-8 text-[0.72rem] font-medium tracking-[0.18em] uppercase hover:bg-primary hover:text-primary-foreground",
                )}
              >
                Δες τον εξοπλισμό
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-96" />}>
        <CatalogSections />
      </Suspense>

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
              <Image
                src={photoUrl(STORY_PHOTO)}
                alt="Παρασκευή καφέ φίλτρου με pour-over"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -right-3 -bottom-6 bg-card/90 px-7 py-6 shadow-sm backdrop-blur-sm md:-right-8">
              <p className="font-heading text-2xl md:text-3xl">Μικρές παρτίδες</p>
              <p className="mt-1 text-[0.68rem] tracking-[0.18em] text-muted-foreground uppercase">
                Ψήνονται κάθε εβδομάδα
              </p>
            </div>
          </div>

          <div>
            <Eyebrow>Η ιστορία μας</Eyebrow>
            <h2 className="font-heading mt-6 text-4xl leading-[1.1] tracking-tight md:text-5xl">
              Μια ιστορία <em className="italic">σπόρου</em>
            </h2>
            <div className="mt-8 max-w-lg space-y-5 leading-relaxed text-muted-foreground">
              <p>
                Ο κόκκος του καφέ είναι ένας σπόρος: ένα μικρό φρούτο που έχει
                μέσα του όλη τη γεύση. Δουλεύουμε με αυτή την ιδέα. Λιγότερες
                παρεμβάσεις, περισσότερος σεβασμός στο υλικό.
              </p>
              <p>
                Κάθε πακέτο γράφει την ημερομηνία ψησίματος, τον παραγωγό και
                το υψόμετρο, για να ξέρεις ακριβώς τι πίνεις.
              </p>
            </div>

            <ul className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-8">
              {STORY_POINTS.map((p) => (
                <li key={p.title}>
                  <span className="grid size-11 place-items-center border border-border">
                    <Icon name={p.icon} className="text-[22px]" />
                  </span>
                  <p className="mt-4 text-sm font-medium">{p.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-10 h-12 rounded-none border-primary bg-transparent px-9 text-[0.72rem] font-medium tracking-[0.18em] uppercase hover:bg-primary hover:text-primary-foreground",
              )}
            >
              Διάβασε την ιστορία
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-secondary/50">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <SectionHeading eyebrow="Εξερεύνησε" title="Οι συλλογές μας" />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {COLLECTIONS.map((c) => (
              <Link
                key={c.key}
                href={`/products?category=${c.key}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-secondary"
              >
                <Image
                  src={photoUrl(COLLECTION_PHOTOS[c.key])}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 33vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-7 text-primary-foreground">
                  <h3 className="font-heading text-3xl">{CATEGORY_LABELS[c.key]}</h3>
                  <p className="mt-1 text-sm text-primary-foreground/80">{c.sub}</p>
                  <p className="mt-5 inline-block border-b border-amber pb-1 text-[0.68rem] font-medium tracking-[0.18em] uppercase">
                    Εξερεύνησε
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <SectionHeading
            light
            eyebrow="Οδηγός παρασκευής"
            title={
              <>
                Φτιάξε τον καφέ <em className="italic">σωστά</em>
              </>
            }
          />
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {GUIDES.map((g) => (
              <div key={g.title}>
                <h3 className="font-heading border-b border-amber/70 pb-4 text-3xl">
                  {g.title}
                </h3>
                <dl className="mt-2 divide-y divide-primary-foreground/15">
                  {g.specs.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-4 text-sm">
                      <dt className="text-primary-foreground/60">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Link
              href="/products?category=equipment"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-none border-primary-foreground/60 bg-transparent px-9 text-[0.72rem] font-medium tracking-[0.18em] text-primary-foreground uppercase hover:bg-primary-foreground hover:text-primary",
              )}
            >
              Δες τον εξοπλισμό
            </Link>
          </div>
          <p className="mt-10 text-center text-xs text-primary-foreground/50">
            {BRAND.name}: οι ποσότητες είναι ενδεικτικές και προσαρμόζονται στη
            γεύση σου.
          </p>
        </div>
      </section>
    </div>
  );
}
