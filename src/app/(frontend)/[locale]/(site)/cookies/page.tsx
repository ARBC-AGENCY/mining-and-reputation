import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("cookies.title"),
    description: t("cookies.description"),
    alternates: alternatesFor(locale, "/cookies"),
  };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("metadata");

  return (
    <div className="mx-auto max-w-3xl px-6 pt-36 pb-20">
      <h1 className="font-display text-gold text-4xl tracking-wide">
        {t("cookies.title")}
      </h1>
    </div>
  );
}
