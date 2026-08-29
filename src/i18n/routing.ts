import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  // Every route carries its locale: /en/about, /fr/about.
  // Keeps canonicals and hreflang unambiguous — no default-locale special case.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
