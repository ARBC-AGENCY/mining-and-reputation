import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("about.title"),
    description: t("about.description"),
    alternates: alternatesFor(locale, "/about"),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("metadata");

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-gold text-4xl tracking-wide">
        {t("about.title")}
      </h1>
      <p className="text-grey-light/70 mt-6">{t("about.description")}</p>
    </div>
  );
}
