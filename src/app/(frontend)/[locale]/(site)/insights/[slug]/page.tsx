import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { ARTICLE_QUERY, ARTICLE_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

// Articles are single-language: the same document is served under every
// locale, with only the surrounding chrome translated.
export async function generateStaticParams() {
  const slugs = await client.fetch(ARTICLE_SLUGS_QUERY);

  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { data: article } = await sanityFetch({
    query: ARTICLE_QUERY,
    params: { slug },
    stega: false,
  });

  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: alternatesFor(locale, `/insights/${slug}`),
    openGraph: {
      type: "article",
      title: article.title ?? undefined,
      description: article.excerpt ?? undefined,
      publishedTime: article.publishedAt ?? undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("article");
  const tInsights = await getTranslations("insights");
  const { data: article } = await sanityFetch({
    query: ARTICLE_QUERY,
    params: { slug },
  });

  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link
        href="/insights"
        className="text-grey-light/60 hover:text-gold text-sm transition-colors"
      >
        {t("back")}
      </Link>

      <h1 className="font-display text-gold mt-8 text-4xl leading-tight tracking-wide">
        {article.title}
      </h1>

      <div className="text-grey-light/50 mt-4 flex flex-wrap gap-x-4 text-sm">
        {article.author?.name && <span>{t("byline", { name: article.author.name })}</span>}
        {article.publishedAt && (
          <span>
            {tInsights("publishedOn", { date: new Date(article.publishedAt) })}
          </span>
        )}
      </div>

      {article.body && (
        <div className="prose-invert text-grey-light/85 mt-12 flex flex-col gap-6">
          <PortableText value={article.body} />
        </div>
      )}
    </article>
  );
}
