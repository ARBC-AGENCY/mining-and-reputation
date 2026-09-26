import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/hero/HomeHero";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { SectorsSection } from "@/components/sections/SectorsSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { MiningVoicesSection } from "@/components/sections/MiningVoicesSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
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
          titleLead: t("titleLead"),
          titleRest: t("titleRest"),
          statementLead: t("statementLead"),
          statementRest: t("statementRest"),
          description: t("description"),
          cta: t("cta"),
          scrollHint: t("scrollHint"),
        }}
      />

      <AboutSection />

      <ExpertiseSection />

      <SectorsSection />

      <BlogSection />

      <MiningVoicesSection />

      <NewsletterSection />

      <FinalCtaSection />
    </>
  );
}
