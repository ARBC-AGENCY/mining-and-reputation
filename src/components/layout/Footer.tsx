import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArbcLink } from "@/components/ArbcLink";
import { Link } from "@/i18n/navigation";
import { SOCIAL_LINKS } from "@/lib/social";

const EXPERTISE_ITEMS = [
  "crisis",
  "media",
  "esg",
  "communities",
  "financial",
  "digital",
] as const;

// Each maps to a hub tab, so these deep-link rather than dumping on the index.
const INSIGHTS_ITEMS = [
  { key: "articles", type: "article" },
  { key: "interviews", type: "interview" },
  { key: "news", type: "news" },
  { key: "reports", type: "resource" },
] as const;

const COMPANY_ITEMS = [
  { key: "about", href: "/about" },
  { key: "caseStudies", href: "/case-studies" },
  { key: "contact", href: "/contact" },
] as const;

const LEGAL_ITEMS = [
  { key: "privacy", href: "/privacy" },
  { key: "notice", href: "/legal" },
  { key: "cookies", href: "/cookies" },
] as const;

export async function Footer() {
  const t = await getTranslations("footer");
  const tMeta = await getTranslations("metadata");
  const social = SOCIAL_LINKS.filter((s) => s.href);

  const heading = "text-grey-light/50 text-xs font-medium tracking-[0.18em] uppercase";
  const item = "text-grey-light/70 hover:text-gold text-sm transition-colors";

  return (
    <footer className="bg-dark border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-2">
            <Link href="/" aria-label={tMeta("siteName")}>
              <Image
                src="/images/LOGO-WHITE@600.png"
                alt={tMeta("siteName")}
                width={600}
                height={167}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-grey-light/60 mt-6 max-w-xs text-sm leading-relaxed">
              {t("tagline")}
            </p>
            <p className="text-grey-light/50 mt-4 text-sm">
              {t.rich("poweredBy", { arbc: ArbcLink })}
            </p>
          </div>

          <nav aria-label={t("expertise")}>
            <h2 className={heading}>{t("expertise")}</h2>
            <ul className="mt-5 space-y-3">
              {EXPERTISE_ITEMS.map((key) => (
                <li key={key}>
                  {/* Individual expertise pages don't exist yet, so these all
                      point at the index rather than 404ing. */}
                  <Link href="/expertise" className={item}>
                    {t(`expertiseItems.${key}` as "expertiseItems.crisis")}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("insights")}>
            <h2 className={heading}>{t("insights")}</h2>
            <ul className="mt-5 space-y-3">
              {INSIGHTS_ITEMS.map(({ key, type }) => (
                <li key={key}>
                  <Link href={`/insights?type=${type}`} className={item}>
                    {t(`insightsItems.${key}` as "insightsItems.articles")}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <nav aria-label={t("company")}>
              <h2 className={heading}>{t("company")}</h2>
              <ul className="mt-5 space-y-3">
                {COMPANY_ITEMS.map(({ key, href }) => (
                  <li key={key}>
                    <Link href={href} className={item}>
                      {t(`companyItems.${key}` as "companyItems.about")}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {social.length > 0 && (
              <nav aria-label={t("follow")} className="mt-10">
                <h2 className={heading}>{t("follow")}</h2>
                <ul className="mt-5 space-y-3">
                  {social.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={item}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-grey-light/50 text-sm">
            &copy; {new Date().getFullYear()} {tMeta("siteName")}. {t("rights")}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_ITEMS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  className="text-grey-light/50 hover:text-gold text-sm transition-colors"
                >
                  {t(`legal.${key}` as "legal.privacy")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
