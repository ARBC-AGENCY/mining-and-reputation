import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  FEATURED_POST_QUERY,
  RECENT_POSTS_QUERY,
} from "@/sanity/lib/queries";

type Card = {
  _id: string;
  format: string | null;
  title: string | null;
  slug: string | null;
  excerpt: string | null;
  publishedAt: string | null;
  coverImage: unknown;
  categories: { title: string | null; slug: string | null }[] | null;
};

function cover(image: unknown, w: number, h: number) {
  if (!image) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return urlFor(image as any).width(w).height(h).fit("crop").auto("format").url();
  } catch {
    return null;
  }
}

export async function BlogSection() {
  const t = await getTranslations("home.blog");
  const tf = await getTranslations("formats");

  const { data: featured } = await sanityFetch({ query: FEATURED_POST_QUERY });
  const { data: recent } = await sanityFetch({
    query: RECENT_POSTS_QUERY,
    params: { excludeId: featured?._id ?? "none" },
  });

  const list = (recent ?? []) as Card[];
  // No post flagged as featured yet — promote the newest one rather than
  // leaving the largest slot on the homepage empty.
  const hero = ((featured as Card | null) ?? list[0]) ?? null;
  const cards = (featured ? list : list.slice(1)).slice(0, 3);

  const formatLabel = (f: string | null) =>
    f && ["article", "interview", "news", "resource"].includes(f)
      ? tf(f as "article" | "interview" | "news" | "resource")
      : tf("article");

  return (
    <section className="bg-dark border-t border-white/5 py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <h2 className="font-display text-[1.75rem] leading-[1.15] text-balance text-white sm:text-3xl md:text-4xl lg:text-5xl">
            {t("heading")}
          </h2>
          <p className="text-grey-light/70 mt-6 text-base leading-relaxed text-pretty md:text-lg">
            {t("intro")}
          </p>
        </Reveal>

        {!hero ? (
          <p className="text-grey-light/50 mt-14">{t("empty")}</p>
        ) : (
          <>
            {/* Featured */}
            <Reveal>
            <Link
              href={`/blog/${hero.slug}`}
              className="group mt-14 grid gap-6 overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-[#F7C15D]/40 md:mt-16 lg:grid-cols-2 lg:gap-0"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[380px]">
                {cover(hero.coverImage, 1200, 800) ? (
                  <Image
                    src={cover(hero.coverImage, 1200, 800)!}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(160deg,#0A2325_0%,#05191A_45%,#353F2C_100%)]" />
                )}
              </div>

              <div className="flex flex-col justify-center p-7 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  {/* "Featured" only when a post is genuinely flagged.
                      A promoted newest post is labelled "Latest" — calling it
                      featured would misrepresent why it is there. */}
                  <span className="text-dark text-xs font-medium tracking-[0.2em] uppercase bg-white px-3 py-1.5 rounded-full">
                    {featured ? t("featured") : t("latest")}
                  </span>
                  <span className="text-grey-light/40" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-grey-light/60 text-xs tracking-wide uppercase">
                    {hero.categories?.[0]?.title ?? formatLabel(hero.format)}
                  </span>
                </div>

                <h3 className="font-display mt-5 text-xl leading-snug text-balance text-white md:text-3xl">
                  {hero.title}
                </h3>
                {hero.excerpt && (
                  <p className="text-grey-light/70 mt-4 text-sm leading-relaxed text-pretty md:text-base">
                    {hero.excerpt}
                  </p>
                )}
                <span className="text-gold mt-7 inline-flex items-center gap-2 text-sm font-medium transition-colors group-hover:text-white">
                  {t("readArticle")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
            </Reveal>

            {/* Three latest */}
            {cards.length > 0 && (
              <div className="mt-5 grid gap-5 md:mt-6 md:grid-cols-3 md:gap-6">
                {cards.map((post, i) => (
                  <Reveal key={post._id} delay={i * 0.08} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[18px] border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-[#F7C15D]/40"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      {cover(post.coverImage, 700, 440) ? (
                        <Image
                          src={cover(post.coverImage, 700, 440)!}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[linear-gradient(160deg,#0A2325_0%,#05191A_45%,#353F2C_100%)]" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <span className="text-[#F7C15D] text-[0.7rem] font-medium tracking-[0.2em] uppercase">
                        {formatLabel(post.format)}
                      </span>
                      <h3 className="font-display mt-3 text-base leading-snug text-balance text-white transition-colors group-hover:text-[#F7C15D] md:text-lg">
                        {post.title}
                      </h3>
                      {post.categories?.[0]?.title && (
                        <span className="text-grey-light/50 mt-auto pt-4 text-xs tracking-wide">
                          {post.categories[0].title}
                        </span>
                      )}
                    </div>
                  </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}

        <Link
          href="/blog?type=article"
          className="text-gold mt-12 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
        >
          {t("cta")}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
