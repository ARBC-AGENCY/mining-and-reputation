import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_NAME, siteUrl } from "./site";

/** Absolute URL of a locale-prefixed page ("" is the locale's home). */
export function localeUrl(locale: string, path = "") {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return `${siteUrl}/${locale}${clean ? `/${clean}` : ""}`;
}

/**
 * Builds canonical + hreflang alternates for a locale-prefixed page.
 *
 * `path` is the pathname WITHOUT the locale segment ("" for the home page,
 * "/blog" for the blog index, and so on).
 */
export function alternatesFor(
  locale: Locale,
  path = "",
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, path)])),
      "x-default": localeUrl(routing.defaultLocale, path),
    },
  };
}

const OG_LOCALE: Record<Locale, string> = { en: "en_GB", fr: "fr_FR" };

/**
 * The Open Graph fields every page shares.
 *
 * Metadata merges shallowly, so a page that sets its own `openGraph` replaces
 * the layout's object wholesale. Pages that need their own Open Graph fields
 * (articles, expertise pages) spread this in so site name and locale survive.
 * Pages that don't set `openGraph` at all inherit the layout's, and Next fills
 * og:title / og:description from their own title and description.
 */
export function openGraphBase(locale: Locale) {
  return {
    siteName: SITE_NAME,
    locale: OG_LOCALE[locale],
    alternateLocale: routing.locales
      .filter((l) => l !== locale)
      .map((l) => OG_LOCALE[l]),
  };
}
