import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostCard, type PostCardData } from "@/components/blog/PostCard";
import { Reveal } from "@/components/motion/Reveal";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { EXPERTISE_AREAS, areaBySlug } from "@/lib/expertise";
import { alternatesFor } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/live";
import { RELATED_POSTS_QUERY } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ locale: Locale; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    EXPERTISE_AREAS.map(({ slug }) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const area = areaBySlug(slug);
  if (!area) return {};

  const t = await getTranslations({ locale, namespace: "expertise" });

  return {
    title: t(`areas.${area.key}.title` as "areas.crisis.title"),
    description: t(`areas.${area.key}.tagline` as "areas.crisis.tagline"),
    alternates: alternatesFor(locale, `/expertise/${slug}`),
  };
}

export default async function ExpertiseDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const area = areaBySlug(slug);
  if (!area) notFound();

  const t = await getTranslations("expertise");
  const { key } = area;

  // Arrays need t.raw() — t() only returns strings.
  const capabilities = t.raw(
    `areas.${key}.capabilities` as "areas.crisis.capabilities",
  ) as string[];
  const approach = t.raw(
    `areas.${key}.approach` as "areas.crisis.approach",
  ) as string[];

  // Matched against the slug on the Sanity `expertise` document that posts
  // reference, so tagging an article surfaces it here automatically.
  const { data } = await sanityFetch({
    query: RELATED_POSTS_QUERY,
    params: { expertise: slug },
  });
  const related = (data ?? []) as PostCardData[];

  return (
    <>
      {/* Hero */}
      <section className="bg-dark pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/expertise"
            className="text-grey-light/60 hover:text-gold inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t("labels.all")}
          </Link>

          <p className="text-gold mt-10 text-xs font-medium tracking-[0.25em] uppercase">
            {t(`areas.${key}.title` as "areas.crisis.title")}
          </p>
          <h1 className="font-display mt-5 max-w-4xl text-[1.9rem] leading-[1.1] text-balance text-white sm:text-4xl md:text-5xl">
            {t(`areas.${key}.tagline` as "areas.crisis.tagline")}
          </h1>
          <p className="text-grey-light/75 mt-8 max-w-3xl text-base leading-relaxed text-pretty md:text-lg">
            {t(`areas.${key}.intro` as "areas.crisis.intro")}
          </p>
        </div>
      </section>

      {/* What we help you manage */}
      <section className="bg-dark border-t border-white/5 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl leading-[1.15] text-balance text-white md:text-4xl">
              {t("labels.manage")}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    className="text-gold mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-grey-light/75 text-sm leading-relaxed md:text-base">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Our approach — a sequence, so numbered and rule-joined like About */}
      <section className="bg-dark border-t border-white/5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl leading-[1.15] text-balance text-white md:text-4xl">
              {t("labels.approach")}
            </h2>
          </Reveal>
          <ol className="mt-12 grid list-none gap-8 md:mt-16 md:grid-cols-4">
            {approach.map((step, i) => (
              <Reveal key={step} delay={i * 0.08} className="h-full">
                <li className="relative h-full">
                  {i < approach.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="from-gold/40 absolute top-5 left-16 hidden h-px w-[calc(100%-3rem)] bg-gradient-to-r to-transparent md:block"
                    />
                  )}
                  <span className="border-gold/40 text-gold grid size-11 place-items-center rounded-full border text-sm font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-5 text-lg text-white md:text-xl">
                    {step}
                  </h3>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Related articles — populated from Sanity by expertise tag */}
      <section className="bg-dark border-t border-white/5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl leading-[1.15] text-balance text-white md:text-4xl">
              {t("labels.related")}
            </h2>
            <Link
              href="/blog"
              className="text-gold inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            >
              {t("labels.all")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          {related.length === 0 ? (
            <p className="text-grey-light/55 mt-10">
              {t("labels.relatedEmpty")}
            </p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {related.map((post, i) => (
                <Reveal key={post._id} delay={i * 0.06} className="h-full">
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Expertise-specific CTA, per the template */}
      <section className="bg-dark border-t border-white/5 py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl leading-[1.15] text-balance text-white md:text-4xl">
              {t("cta.heading")}
            </h2>
            <p className="text-grey-light/70 mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty md:text-lg">
              {t("cta.text")}
            </p>
            <Link
              href="/contact"
              className="border-gold/40 text-gold hover:border-gold hover:bg-gold/10 mt-10 inline-flex items-center gap-2 rounded-[18px] border px-7 py-3.5 text-sm font-medium transition-colors hover:text-white"
            >
              {t("cta.button")}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
