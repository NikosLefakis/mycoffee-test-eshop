// Public base URL, used for canonical links, the sitemap and structured data.
// Set NEXT_PUBLIC_SITE_URL once the shop has a custom domain.
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000")
).replace(/\/$/, "");
