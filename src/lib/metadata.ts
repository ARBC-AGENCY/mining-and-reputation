import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { siteUrl } from "./site";

/**
 * Builds canonical + hreflang alternates for a locale-prefixed page.
 *
 * `path` is the pathname WITHOUT the locale segment ("" for the home page,
 * "/insights" for the insights index, and so on).
 */
export function alternatesFor(
  locale: Locale,
  path = "",
): NonNullable<Metadata["alternates"]> {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const href = (l: string) => `${siteUrl}/${l}${clean ? `/${clean}` : ""}`;

  return {
    canonical: href(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, href(l)])),
      "x-default": href(routing.defaultLocale),
    },
  };
}
