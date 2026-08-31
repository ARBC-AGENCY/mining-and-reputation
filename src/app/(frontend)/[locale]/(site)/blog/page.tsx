import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BlogTabs } from "@/components/blog/BlogTabs";
import { TAB_VALUES, type TabValue } from "@/lib/blog-tabs";
import { PostCard, type PostCardData } from "@/components/blog/PostCard";
import type { Locale } from "@/i18n/routing";
import { alternatesFor } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

const PAGE_SIZE = 12;

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("blog.title"),
    description: t("blog.description"),
    alternates: alternatesFor(locale, "/blog"),
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { type } = await searchParams;
  setRequestLocale(locale);

  // Anything unrecognised falls back to All rather than 404ing.
  const tab: TabValue = (TAB_VALUES as readonly string[]).includes(type ?? "")
    ? (type as TabValue)
    : "all";
  const format = tab === "all" ? null : tab;

  const t = await getTranslations("blog");
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
    params: { format, from: 0, to: PAGE_SIZE },
  });
  const posts = (data ?? []) as PostCardData[];

  return (
    <div className="mx-auto max-w-7xl px-6 pt-36 pb-24 lg:px-8">
      <h1 className="font-display text-[1.75rem] leading-[1.15] text-balance text-white sm:text-3xl md:text-4xl lg:text-5xl">
        {t("heading")}
      </h1>
      <p className="text-grey-light/70 mt-5 max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
        {t("intro")}
      </p>

      <div className="mt-10 md:mt-12">
        <BlogTabs current={tab} />
      </div>

      {posts.length === 0 ? (
        <p className="text-grey-light/55 mt-16">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
