import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/hero/HomeHero";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

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
      {/* Placeholder for the next section — keeps the scroll out of the hero
          from ending abruptly. Replace as the homepage is designed. */}
      <section className="bg-dark min-h-[60svh]" />
    </>
  );
}
