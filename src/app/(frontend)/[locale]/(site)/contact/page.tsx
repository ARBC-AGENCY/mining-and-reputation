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
    title: t("contact.title"),
    description: t("contact.description"),
    alternates: alternatesFor(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("metadata");

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-36">
      <h1 className="font-display text-gold text-4xl tracking-wide">
        {t("contact.title")}
      </h1>
      <p className="text-grey-light/70 mt-6">{t("contact.description")}</p>
    </div>
  );
}
