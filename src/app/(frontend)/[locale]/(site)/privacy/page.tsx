import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("privacy.title"),
    description: t("privacy.description"),
    alternates: alternatesFor(locale, "/privacy"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("metadata");

  return (
    <div className="mx-auto max-w-3xl px-6 pt-36 pb-20">
      <h1 className="font-display text-gold text-4xl tracking-wide">
        {t("privacy.title")}
      </h1>
    </div>
  );
}
