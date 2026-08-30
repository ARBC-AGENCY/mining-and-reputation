import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/hero/HomeHero";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

// Order here drives the 01..06 numbering on the cards.
const CARD_KEYS = [
  "crisis",
  "media",
  "esg",
  "community",
  "financial",
  "digital",
] as const;

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates: alternatesFor(locale, ""),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home.hero");
  const tx = await getTranslations("home.expertise");

  return (
    <>
      <HomeHero
        strings={{
          brand: t("brand"),
          scrollHint: t("scrollHint"),
          imageAlt: t("imageAlt"),
          title: t("title"),
          description: t("description"),
          cta: t("cta"),
        }}
      />
      <ExpertiseSection
        strings={{
          heading: tx("heading"),
          intro: tx("intro"),
          cta: tx("cta"),
          carouselLabel: tx("carouselLabel"),
          cards: CARD_KEYS.map((key, i) => ({
            eyebrow: String(i + 1).padStart(2, "0"),
            title: tx(`cards.${key}.title`),
            description: tx(`cards.${key}.description`),
          })),
        }}
      />
    </>
  );
}
