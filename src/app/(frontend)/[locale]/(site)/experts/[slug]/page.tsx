import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";
import { localeUrl } from "@/lib/metadata";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { expertBySlug, getPublishedProfiles } from "@/lib/experts";
import { alternatesFor } from "@/lib/metadata";

type Props = {
  params: Promise<{
    locale: Locale;
    slug: string;
  }>;
};

type Experience = {
  organization: string;
  period: string;
  title: string;
  description: string;
};

type ProfileContent = {
  role: string;
  name: string;
  headline: string;
  intro: string;
  biography: string[];
  specialties: string[];
  experiences: Experience[];
  quote: string;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPublishedProfiles().map((expert) => ({
      locale,
      slug: expert.slug,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const expert = expertBySlug(slug);

  if (!expert) return {};

  const t = await getTranslations({
    locale,
    namespace: "experts",
  });

  const content = t.raw(`profiles.${expert.id}`) as ProfileContent;

  return {
    title: `${expert.name} — ${content.role}`,
    description: content.intro,
    alternates: alternatesFor(locale, `/experts/${expert.slug}`),
    openGraph: {
      title: `${expert.name} | Mining & Reputation`,
      description: content.intro,
      type: "profile",
      images: [
        {
          url: expert.image,
          alt: expert.name,
        },
      ],
    },
  };
}

export default async function ExpertProfilePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const expert = expertBySlug(slug);

  if (!expert) notFound();

  const t = await getTranslations("experts");

  const content = t.raw(`profiles.${expert.id}`) as ProfileContent;

  const profileUrl = localeUrl(locale, `/experts/${expert.slug}`);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: expert.name,
    description: content.intro,
    image: new URL(expert.image, profileUrl).toString(),
    url: profileUrl,
    jobTitle: content.role,
  };

  return (
    <>
      <JsonLd data={personSchema} />

      <JsonLd
        data={breadcrumbs([
          [t("detail.back"), localeUrl(locale, "/experts")],
          [expert.name, profileUrl],
        ])}
      />

      <main className="bg-dark text-grey-light">
        {/* =====================================================
          01 — EDITORIAL PROFILE HERO
          ===================================================== */}
        <section
          aria-labelledby="expert-name"
          className="relative overflow-hidden pt-32 md:pt-40 lg:pt-44"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <Link
                href="/experts"
                className="text-grey-light/60 hover:text-gold inline-flex items-center gap-3 text-sm transition-colors"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t("detail.back")}
              </Link>
            </Reveal>

            <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
              {/* Left: introduction */}
              <div className="flex flex-col items-start">
                <Reveal>
                  <p className="text-gold text-xs font-medium tracking-[0.22em] uppercase">
                    {t("detail.profileLabel")}
                    <span className="text-grey-light/30 mx-3">/</span>
                    {String(expert.order).padStart(3, "0")}
                  </p>
                </Reveal>

                <SplitLines
                  as="h1"
                  id="expert-name"
                  className="font-display mt-8 max-w-2xl text-[clamp(2rem,3vw,6rem)] leading-[1.02] text-balance text-white"
                >
                  {expert.name}
                </SplitLines>

                <Reveal delay={0.1}>
                  <p className="text-gold mt-7 max-w-lg text-sm leading-relaxed font-normal tracking-[0.06em] uppercase">
                    {content.role}
                  </p>
                </Reveal>

                <Reveal delay={0.16}>
                  <h2 className="font-display text-grey-light mt-7 text-[clamp(1rem,2vw,1.5rem)] leading-[1.2] text-balance">
                    {content.headline}
                  </h2>
                </Reveal>

                <Reveal delay={0.22}>
                  <p className="text-grey-light/65 mt-5 max-w-lg text-base leading-relaxed md:text-lg">
                    {content.intro}
                  </p>
                </Reveal>
              </div>

              {/* Right: portrait */}
              <Reveal delay={0.12} y={45}>
                <div className="relative aspect-3/4 w-full overflow-hidden bg-white/5">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    priority
                    sizes="(min-width: 1024px) 43vw, 100vw"
                    className="object-cover"
                    style={{
                      objectPosition: expert.imagePosition,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-dark/20 via-transparent to-transparent"
                  />
                </div>
              </Reveal>
            </div>

            {/* Experience marker */}
            {expert.experienceYears !== undefined && (
              <div className="mt-16 flex items-end justify-between gap-8 border-t border-white/10 py-10 md:mt-24">
                <Reveal>
                  <div className="flex items-end gap-5">
                    <span className="font-display text-gold text-5xl leading-none md:text-7xl">
                      {expert.experienceYears}+
                    </span>

                    <span className="text-grey-light/55 max-w-32 pb-1 text-sm leading-snug">
                      {t("detail.experienceYears")}
                    </span>
                  </div>
                </Reveal>

                <span className="text-grey-light/35 hidden text-xs tracking-[0.18em] uppercase sm:block">
                  Mining & Reputation
                </span>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
          02 — PROFESSIONAL OVERVIEW
          ===================================================== */}
        <section
          aria-labelledby="expert-overview"
          className="border-t border-white/10 py-20 md:py-28"
        >
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-8">
            <Reveal>
              <div>
                <p className="text-gold text-xs tracking-[0.2em] uppercase">
                  01 / {t("detail.overview")}
                </p>

                <h2
                  id="expert-overview"
                  className="font-display mt-6 text-3xl leading-tight text-white md:text-4xl"
                >
                  {t("detail.overview")}
                </h2>
              </div>
            </Reveal>

            <div className="space-y-6">
              {content.biography.map((paragraph, index) => (
                <Reveal key={index} delay={index * 0.08}>
                  <p className="text-grey-light/75 max-w-2xl text-base leading-[1.85] md:text-lg">
                    {paragraph}
                  </p>
                </Reveal>
              ))}

              {content.quote && (
                <Reveal delay={0.12}>
                  <blockquote className="border-gold/50 mt-12 border-l-2 py-2 pl-6">
                    <p className="font-display text-gold text-xl leading-relaxed italic md:text-2xl">
                      “{content.quote}”
                    </p>
                    <footer className="text-grey-light/45 mt-4 text-sm">
                      — {expert.name}
                    </footer>
                  </blockquote>
                </Reveal>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
          03 — AREAS OF EXPERTISE
          ===================================================== */}
        <section
          aria-labelledby="expert-specialties"
          className="border-t border-white/10 py-20 md:py-28"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <p className="text-gold text-xs tracking-[0.2em] uppercase">
                02 / {t("detail.specialties")}
              </p>
            </Reveal>

            <SplitLines
              as="h2"
              id="expert-specialties"
              className="font-display mt-6 text-3xl leading-tight text-white md:text-4xl"
            >
              {t("detail.specialties")}
            </SplitLines>

            <div className="mt-12 grid border-t border-white/10 md:mt-16 md:grid-cols-2 md:gap-x-12">
              {content.specialties.map((item, index) => (
                <Reveal key={index} delay={(index % 2) * 0.08}>
                  <div className="flex min-h-24 items-center gap-6 border-b border-white/10 py-6">
                    <span className="text-gold/75 text-xs tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3 className="font-display text-grey-light text-lg leading-snug md:text-xl">
                      {item}
                    </h3>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
          04 — SELECTED EXPERIENCE
          ===================================================== */}
        <section
          aria-labelledby="expert-experience"
          className="border-t border-white/10 py-20 md:py-28"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal>
              <p className="text-gold text-xs tracking-[0.2em] uppercase">
                03 / {t("detail.experience")}
              </p>
            </Reveal>

            <SplitLines
              as="h2"
              id="expert-experience"
              className="font-display mt-6 max-w-3xl text-3xl leading-tight text-white md:text-4xl"
            >
              {t("detail.experience")}
            </SplitLines>

            <div className="mt-12 border-t border-white/10 md:mt-16">
              {content.experiences.map((experience, index) => (
                <Reveal
                  key={`${experience.organization}-${index}`}
                  delay={0.06}
                >
                  <article className="grid gap-6 border-b border-white/10 py-9 md:grid-cols-[0.15fr_0.35fr_0.5fr] md:gap-10 md:py-12">
                    <span className="text-gold text-xs tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3 className="font-display text-xl leading-snug text-white md:text-2xl">
                        {experience.organization}
                      </h3>
                      <p className="text-gold/75 mt-3 text-sm">
                        {experience.period}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-grey-light text-base font-semibold md:text-lg">
                        {experience.title}
                      </h4>

                      <p className="text-grey-light/60 mt-4 max-w-lg text-sm leading-[1.8] md:text-base">
                        {experience.description}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
          05 — CONTACT AND RETURN NAVIGATION
          ===================================================== */}
        <section className="border-t border-white/10 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-end gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-20">
              <div>
                <Reveal>
                  <p className="text-gold text-xs tracking-[0.2em] uppercase">
                    Mining & Reputation
                  </p>
                </Reveal>

                <SplitLines
                  as="h2"
                  className="font-display mt-6 max-w-3xl text-[clamp(2rem,4vw,4rem)] leading-[1] text-white"
                >
                  {t("detail.contactTitle")}
                </SplitLines>
              </div>

              <Reveal delay={0.1}>
                <div>
                  <p className="text-grey-light/70 max-w-md text-base leading-relaxed">
                    {t("detail.contactDescription")}
                  </p>

                  <Link
                    href="/contact"
                    className="border-gold/40 text-gold hover:border-gold hover:bg-gold/10 mt-8 inline-flex items-center gap-3 rounded-[18px] border px-7 py-3.5 text-sm font-medium transition-colors hover:text-white"
                  >
                    {t("detail.contactButton")}

                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="mt-20 border-t border-white/10 pt-8">
              <Link
                href="/experts"
                className="text-grey-light/60 hover:text-gold inline-flex items-center gap-3 text-sm transition-colors"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t("detail.back")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
