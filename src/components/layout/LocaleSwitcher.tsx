"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const active = useLocale();
  // next-intl's usePathname returns the path WITHOUT the locale prefix,
  // so the same href can be re-pointed at any locale.
  const pathname = usePathname();

  return (
    <nav aria-label={t("language")} className="flex items-center gap-2">
      {routing.locales.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            aria-current={isActive ? "true" : undefined}
            className={
              isActive
                ? "text-gold text-sm font-medium uppercase"
                : "text-grey-light/60 hover:text-grey-light text-sm uppercase transition-colors"
            }
          >
            {locale}
          </Link>
        );
      })}
    </nav>
  );
}
