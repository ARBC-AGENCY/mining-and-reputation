import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    // Pinned so dates format identically on server and client. Without this
    // next-intl falls back to the server's zone, which drifts from the
    // visitor's and causes hydration mismatches.
    timeZone: "UTC",
  };
});
