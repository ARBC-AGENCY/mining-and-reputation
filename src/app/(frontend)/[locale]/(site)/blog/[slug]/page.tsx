import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { PortableBody } from "@/components/portable/PortableBody";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { urlFor } from "@/sanity/lib/image";
import { routing, type Locale } from "@/i18n/routing";
import { alternatesFor, localeUrl, openGraphBase } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/site";
import { article as articleLd, breadcrumbs } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

// Articles are single-language: the same document is served under every
// locale, with only the surrounding chrome translated.
export async function generateStaticParams() {
  const slugs = await client.fetch(POST_SLUGS_QUERY);

  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

/**
 * A post written in one language is still served under both locales. When
 * the editor has set its language, both URLs name that version as canonical
 * (and only it is offered as an alternate), so search engines index the
 * original once instead of seeing two near-duplicates.
 */
function postAlternates(
  locale: Locale,
  slug: string,
  language: string | null | undefined,
): NonNullable<Metadata["alternates"]> {
  const path = `/blog/${slug}`;
  if (language !== "en" && language !== "fr") return alternatesFor(locale, path);
  const original = localeUrl(language, path);
  return {
    canonical: original,
    languages: { [language]: original, "x-default": original },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const { data: article } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    stega: false,
  });

  if (!article) return {};

  const title = article.seo?.metaTitle || article.title || SITE_NAME;
  const description = article.seo?.metaDescription || article.excerpt || undefined;

  return {
    title,
    description,
    alternates: postAlternates(locale, slug, article.language),
    // Share image: opengraph-image.tsx beside this page.
    openGraph: {
      ...openGraphBase(locale),
      type: "article",
      title,
      description,
      url: localeUrl(locale, `/blog/${slug}`),
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article._updatedAt ?? undefined,
      authors: article.author?.name ? [article.author.name] : undefined,
    },
    ...(article.seo?.noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("article");
  const tBlog = await getTranslations("blog");
  const { data: article } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
  });

  if (!article) {
    notFound();
  }

  let poster: string | null = null;
  if (article.coverImage) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      poster = urlFor(article.coverImage as any)
        .width(1280)
        .height(720)
        .fit("crop")
        .auto("format")
        .url();
    } catch {
      poster = null;
    }
  }

  const url = localeUrl(locale, `/blog/${slug}`);
  const tNav = await getTranslations("nav");

  return (
    <article className="mx-auto max-w-3xl px-6 pb-20 pt-36">
      <JsonLd
        data={articleLd({
          headline: article.seo?.metaTitle || article.title || SITE_NAME,
          description: article.seo?.metaDescription || article.excerpt,
          url,
          image: poster,
          datePublished: article.publishedAt,
          dateModified: article._updatedAt,
          author: article.author?.name,
          locale: article.language ?? locale,
        })}
      />
      <JsonLd
        data={breadcrumbs([
          [tNav("home"), localeUrl(locale)],
          [tNav("blog"), localeUrl(locale, "/blog")],
          [article.title ?? SITE_NAME, url],
        ])}
      />
      <Link
        href="/blog"
        className="text-grey-light/60 hover:text-gold text-sm transition-colors"
      >
        {t("back")}
      </Link>

      <h1 className="font-display text-gold mt-8 text-4xl leading-tight tracking-wide">
        {article.title}
      </h1>

      {/* Standfirst: the same description used on cards and the homepage. */}
      {article.excerpt && (
        <p className="text-grey-light/80 mt-6 text-lg leading-relaxed text-pretty">
          {article.excerpt}
        </p>
      )}

      <div className="text-grey-light/50 mt-4 flex flex-wrap gap-x-4 text-sm">
        {article.author?.name && <span>{t("byline", { name: article.author.name })}</span>}
        {article.publishedAt && (
          <span>
            {tBlog("publishedOn", { date: new Date(article.publishedAt) })}
          </span>
        )}
      </div>

      {/* Interviews lead with the video. Click-to-play, so nothing loads from
          YouTube or Vimeo until the viewer asks for it. */}
      {article.videoUrl && (
        <div className="mt-10">
          <VideoEmbed
            url={article.videoUrl}
            poster={poster}
            title={article.title ?? null}
          />
        </div>
      )}

      {/* Reports carry a downloadable file — surface it above the body so it
          isn't buried under the text. */}
      {article.file?.asset?.url && (
        <a
          href={article.file.asset.url}
          download
          className="border-gold/40 bg-gold/10 hover:border-gold group mt-10 flex items-center justify-between gap-4 rounded-[14px] border px-5 py-4 transition-colors"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-white">
              {article.file.asset.originalFilename ?? article.title}
            </span>
            <span className="text-grey-light/60 mt-1 block text-xs">
              {t("downloadHint", {
                ext: (article.file.asset.originalFilename ?? "")
                  .split(".")
                  .pop()
                  ?.toUpperCase() || "FILE",
                size: article.file.asset.size
                  ? `${Math.max(1, Math.round(article.file.asset.size / 1024))} KB`
                  : "",
              })}
            </span>
          </span>
          <span className="text-gold inline-flex shrink-0 items-center gap-2 text-sm font-medium transition-colors group-hover:text-white">
            {t("download")}
            <Download className="size-4" aria-hidden="true" />
          </span>
        </a>
      )}

      {article.body && (
        <div className="mt-12 flex flex-col gap-6">
          <PortableBody value={article.body} />
        </div>
      )}
    </article>
  );
}
