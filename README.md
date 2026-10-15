# My Coffee

**Live demo:** https://mycoffee-eshopp.vercel.app

Εκπαιδευτικό e-shop για ένα φανταστικό κατάστημα ειδικού καφέ και αξεσουάρ. Ολόκληρο το καλάθι, το checkout, η αποθήκευση παραγγελιών και η προσομοίωση πληρωμής λειτουργούν. **Δεν γίνονται πραγματικές χρεώσεις** και δεν ζητούνται στοιχεία κάρτας.

## Τεχνολογίες

- Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4
- shadcn/ui (μόνο το Button) και Material Symbols από τη Google για εικονίδια
- Postgres (Neon) με το πακέτο `pg`
- Zod για validation, κοινό σε client και server
- Φωτογραφίες από το [Unsplash](https://unsplash.com) (δωρεάν άδεια)

## Εκκίνηση

```bash
npm install
cp .env.example .env.local   # βάλε το POSTGRES_URL σου
npm run db:setup             # δημιουργεί πίνακες και 12 προϊόντα (σβήνει τα υπάρχοντα δεδομένα)
npm run dev                  # http://localhost:3000
```

Production: `npm run build` και `npm run start`.

## Μεταβλητές περιβάλλοντος

| Όνομα | Απαιτείται | Σκοπός |
| --- | --- | --- |
| `POSTGRES_URL` | ναι | Σύνδεση με τη βάση. Μόνο στον server, δεν φτάνει ποτέ στον browser. |
| `NEXT_PUBLIC_SITE_URL` | στο production | Δημόσιο URL για canonical, sitemap και robots. Ορίζεται πριν το build. |

## Πώς λειτουργεί η αγορά

1. Το καλάθι ζει στον browser (`localStorage`) και κρατά μόνο προϊόντα και ποσότητες.
2. Στο checkout, ο server ξαναϋπολογίζει όλες τις τιμές από τη βάση και ελέγχει διαθεσιμότητα. Δεν εμπιστεύεται τίποτα από τον browser.
3. Η πληρωμή είναι προσομοίωση (επιτυχής ή αποτυχημένη). Παραγγελία αποθηκεύεται μόνο αν πετύχει.
4. Η παραγγελία έχει τυχαίο UUID στο URL. Διπλή υποβολή επιστρέφει την ίδια παραγγελία.

## Δομή

```
db/                 schema.sql, seed.sql, setup.mjs
src/app/            σελίδες, server actions, robots, sitemap
src/components/     UI και φόρμες
src/lib/            βάση, προϊόντα, παραγγελίες, schemas, brand, φωτογραφίες
```

Το όνομα και το σλόγκαν του brand ορίζονται μόνο στο `src/lib/brand.ts`.

## Για πραγματική παραγωγική χρήση

Το project είναι demo. Πριν δεχτείς πραγματικές παραγγελίες χρειάζονται, μεταξύ άλλων: πραγματικός πάροχος πληρωμών (π.χ. Stripe) με webhooks, αποστολή emails επιβεβαίωσης, rate limiting, διαχείριση αποθέματος και παραγγελιών, νομικά και φορολογικά θέματα (όροι χρήσης, πολιτική απορρήτου, ΦΠΑ, πολιτική επιστροφών) και συγκατάθεση και δυνατότητα διαγραφής για το newsletter.
