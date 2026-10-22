import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getPublishedExperts, type Expert } from "@/lib/experts";
import { alternatesFor } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "experts.metadata",
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: alternatesFor(locale, "/experts"),
  };
}

/**
 * Directory card.
 *
 * The portrait is the primary visual element.
 * The name and expertise remain below the image,
 * following the editorial reference design.
 */
type CardProps = {
  expert: Expert;
  role: ReactNode;
  viewProfile: string;
  index: number;
};

function ExpertCard({ expert, role, viewProfile, index }: CardProps) {
  const href = `/experts/${expert.slug}`;

  const content = (
    <>
      <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
        <Image
          src={expert.image}
          alt={expert.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 48vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          style={{ objectPosition: expert.imagePosition }}
        />

        {expert.profilePublished && (
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-end justify-end bg-linear-to-t from-black/30 via-transparent to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm">
              <ArrowRight className="size-5 -rotate-45" />
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[0.8rem] leading-snug font-semibold tracking-[0.045em] text-grey-light uppercase sm:text-sm">
            {expert.name}
          </h2>

          <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-grey-light/60 sm:text-sm">
            {role}
          </p>
        </div>

        {expert.profilePublished && (
          <ArrowRight
            aria-hidden="true"
            className="mt-1 size-4 shrink-0 -rotate-45 text-grey-light/50 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold"
          />
        )}
      </div>
    </>
  );

  return (
    <Reveal delay={Math.min(index % 4, 3) * 0.09} y={38} className="h-full">
      <article className="h-full">
        {expert.profilePublished ? (
          <Link
            href={href}
            aria-label={`${viewProfile}: ${expert.name}`}
            className="group block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
          >
            {content}
          </Link>
        ) : (
          <div className="group">{content}</div>
        )}
      </article>
    </Reveal>
  );
}

/**
 * Experts directory.
 *
 * Server-rendered and localized, with the existing
 * animation components providing small client islands.
 */
export default async function ExpertsPage({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations("experts");
  const experts = getPublishedExperts();

  return (
    <>
      <main>
        <section
          aria-labelledby="experts-heading"
          className="bg-dark pt-36 pb-20 text-[#202020] sm:pt-44 md:pb-28 lg:pt-48"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Editorial introduction */}
            <div className="grid gap-10 border-b border-white/10 pb-16 md:grid-cols-2 md:gap-16 md:pb-24 lg:gap-24">
              <SplitLines
                as="h1"
                id="experts-heading"
                className="font-display text-[clamp(2rem,5vw,6rem)] leading-[0.74] tracking-[-0.035em]"
              >
                <span data-split className="block text-grey-light">
                  {t("hero.lead")}
                </span>

                <span data-split className="block text-gold">
                  {t("hero.highlight")}
                </span>
              </SplitLines>

              <div className="flex flex-col justify-end gap-6 md:pb-2 lg:pl-12">
                <Reveal delay={0.1}>
                  <p className="max-w-md text-lg leading-[1.4] font-medium text-grey-light md:text-xl lg:text-2xl">
                    {t("hero.intro")}
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <p className="max-w-md text-sm leading-relaxed text-grey-light/65 md:text-base">
                    {t("hero.description")}
                  </p>
                </Reveal>
              </div>
            </div>

            {/* Directory introduction */}
            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 md:mt-20">
              <Reveal>
                <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
                  {t("directory.label")}
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <span className="text-xs tracking-[0.08em] text-grey-light/50 uppercase">
                  {t("directory.count", {
                    count: experts.length,
                  })}
                </span>
              </Reveal>
            </div>

            {/* Portrait gallery */}
            <div
              className={[
                "mt-8 grid gap-x-4 gap-y-12",
                "sm:grid-cols-2 sm:gap-x-5",
                "lg:gap-x-6 lg:gap-y-16",
                experts.length >= 4
                  ? "lg:grid-cols-4"
                  : experts.length >= 3
                    ? "lg:grid-cols-3"
                    : "lg:grid-cols-2 lg:max-w-4xl",
              ].join(" ")}
            >
              {experts.map((expert, index) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  index={index}
                  role={t.rich(`profiles.${expert.id}.role`, {
                    br: () => <br />,
                  })}
                  viewProfile={t("directory.viewProfile")}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="bg-dark border-t border-white/10 py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid items-end gap-12 md:grid-cols-[1.25fr_0.75fr] md:gap-20">
              <div>
                <Reveal>
                  <p className="text-gold text-xs font-semibold tracking-[0.22em] uppercase">
                    {t("cta.eyebrow")}
                  </p>
                </Reveal>

                <SplitLines
                  as="h2"
                  className="font-display mt-7 max-w-3xl text-[clamp(2.2rem,4vw,4.6rem)] leading-[1.08] text-white"
                >
                  {t("cta.title")}
                </SplitLines>
              </div>

              <Reveal delay={0.1}>
                <div className="flex flex-col items-start gap-8">
                  <p className="text-grey-light/70 max-w-md text-base leading-relaxed">
                    {t("cta.description")}
                  </p>

                  <Link
                    href="/contact"
                    className="border-gold/40 text-gold hover:border-gold hover:bg-gold/10 inline-flex items-center gap-3 rounded-[18px] border px-7 py-3.5 text-sm font-medium transition-colors hover:text-white"
                  >
                    {t("cta.button")}

                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
