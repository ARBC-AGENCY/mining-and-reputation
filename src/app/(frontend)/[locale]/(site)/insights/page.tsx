import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/live";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("insights.title"),
    description: t("insights.description"),
    alternates: alternatesFor(locale, "/insights"),
  };
}

export default async function InsightsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("insights");
  const { data: articles } = await sanityFetch({ query: ARTICLES_QUERY });

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-36">
      <h1 className="font-display text-gold text-4xl tracking-wide">
        {t("heading")}
      </h1>
      <p className="text-grey-light/70 mt-4 max-w-2xl">{t("intro")}</p>

      {articles.length === 0 ? (
        <p className="text-grey-light/60 mt-16">{t("empty")}</p>
      ) : (
        <ul className="mt-16 flex flex-col gap-12">
          {articles.map((article) => (
            <li key={article._id}>
              <article>
                <h2 className="font-display text-2xl">
                  <Link
                    href={`/insights/${article.slug}`}
                    className="text-grey-light hover:text-gold transition-colors"
                  >
                    {article.title}
                  </Link>
                </h2>
                {article.publishedAt && (
                  <p className="text-grey-light/50 mt-2 text-sm">
                    {t("publishedOn", { date: new Date(article.publishedAt) })}
                  </p>
                )}
                {article.excerpt && (
                  <p className="text-grey-light/70 mt-3 max-w-2xl">
                    {article.excerpt}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
