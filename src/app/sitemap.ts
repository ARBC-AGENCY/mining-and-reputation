import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { EXPERTISE_AREAS } from "@/lib/expertise";
import { localeUrl } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { SITEMAP_POSTS_QUERY } from "@/sanity/lib/queries";

/** Re-read Sanity hourly, so new posts appear without a redeploy. */
export const revalidate = 3600;

/** Every page that exists in both locales (pathname without the locale). */
const PAGES = [
  "",
  "/about",
  "/expertise",
  ...EXPERTISE_AREAS.map(({ slug }) => `/expertise/${slug}`),
  "/blog",
  "/case-studies",
  "/contact",
  "/legal",
  "/privacy",
  "/cookies",
  "/experts",
];

const bothLocales = (path: string) => ({
  languages: {
    ...Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, path)])),
    "x-default": localeUrl(routing.defaultLocale, path),
  },
});

/**
 * /sitemap.xml — each URL carries its hreflang alternates, matching the
 * <link rel="alternate"> tags on the pages themselves.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = PAGES.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, path),
      alternates: bothLocales(path),
    })),
  );

  // A CMS outage must not take the sitemap down with it.
  const posts = await client.fetch(SITEMAP_POSTS_QUERY).catch(() => []);

  for (const post of posts) {
    if (!post.slug) continue;
    const path = `/blog/${post.slug}`;
    const lastModified = post._updatedAt ?? post.publishedAt ?? undefined;

    // Posts with a language: list only the original (the page's canonical).
    if (post.language === "en" || post.language === "fr") {
      entries.push({ url: localeUrl(post.language, path), lastModified });
      continue;
    }
    for (const locale of routing.locales) {
      entries.push({ url: localeUrl(locale, path), lastModified, alternates: bothLocales(path) });
    }
  }

  return entries;
}
