/** Production origin. Canonicals, hreflang, sitemap and structured data use it. */
const PRODUCTION_URL = "https://miningreputation.com";

/**
 * Absolute origin, no trailing slash. Falls back to production rather than
 * localhost: a forgotten env var must never ship localhost canonicals.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL
).replace(/\/+$/, "");

/** The brand as written — the "&" included. */
export const SITE_NAME = "Mining & Reputation";

/**
 * Whether search engines may index this deployment.
 *
 * Only production is indexable: on Vercel that is VERCEL_ENV=production
 * (previews and branch deploys are not); elsewhere, a production build.
 * SITE_NOINDEX=1 forces a block, e.g. on a self-hosted staging server.
 * When false, robots.txt disallows everything and every page is noindex.
 */
export const indexable =
  process.env.SITE_NOINDEX !== "1" &&
  (process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production");

/** Parent agency behind the Mining & Reputation initiative. */
export const ARBC_URL = "https://www.arbc-agency.com/";
