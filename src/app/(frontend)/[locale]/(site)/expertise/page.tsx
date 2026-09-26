import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { ExpertiseShowcase } from "@/components/sections/ExpertiseShowcase";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { EXPERTISE_AREAS, expertiseImage } from "@/lib/expertise";
import { alternatesFor } from "@/lib/metadata";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("expertise.title"),
    description: t("expertise.description"),
    alternates: alternatesFor(locale, "/expertise"),
  };
}

export default async function ExpertisePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("expertise");
  const tc = await getTranslations("carousel");
  const tHome = await getTranslations("home.expertise");
  const total = EXPERTISE_AREAS.length;

  const title = (key: string) => t(`areas.${key}.title` as "areas.crisis.title");
  const tagline = (key: string) =>
    t(`areas.${key}.tagline` as "areas.crisis.tagline");

  return (
    <>
      {/* Hero (design p.16): the home showcase, numbered, one link per card. */}
      <ExpertiseShowcase
        variant="page"
        strings={{
          headingLead: t("hero.headingLead"),
          headingRest: t("hero.headingRest"),
          intro: t("hero.text"),
          cardLink: t("labels.explore"),
          label: tHome("carouselLabel"),
          previous: tc("previous"),
          next: tc("next"),
          pause: tc("pause"),
          play: tc("play"),
        }}
        slides={EXPERTISE_AREAS.map(({ key, slug }, i) => ({
          title: title(key),
          text: tagline(key),
          image: expertiseImage(slug),
          href: `/expertise/${slug}`,
          position: tc("position", { current: i + 1, total }),
        }))}
      />

      {/* The whole offer at a glance — every area one click away. */}
      <section
        aria-labelledby="expertise-index"
        className="bg-dark py-20 md:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SplitLines
            as="h2"
            id="expertise-index"
            className="font-display max-w-3xl text-[1.75rem] leading-[1.1] text-balance text-white md:text-4xl"
          >
            {t("labels.indexHeading")}
          </SplitLines>

          <ol className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {EXPERTISE_AREAS.map(({ key, slug }, i) => (
              <li key={key} className="h-full">
                <Reveal delay={(i % 3) * 0.08} y={40} className="h-full">
                  <Link
                    href={`/expertise/${slug}`}
                    className="group hover:border-gold/40 focus-visible:outline-gold flex h-full flex-col overflow-hidden rounded-tr-[3.5rem] border border-white/8 bg-white/2.5 transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4"
                  >
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={expertiseImage(slug)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-1200 ease-out group-hover:scale-[1.06]"
                      />
                      <div
                        aria-hidden="true"
                        className="from-dark via-dark/10 absolute inset-0 bg-linear-to-t to-transparent"
                      />
                      <span
                        aria-hidden="true"
                        className="font-display absolute bottom-2 left-7 text-6xl leading-none text-white/25 transition-colors duration-500 group-hover:text-gold/60"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col px-7 pt-5 pb-7">
                      <h3 className="font-display group-hover:text-gold text-xl leading-snug text-balance text-white transition-colors">
                        {title(key)}
                      </h3>
                      <p className="text-grey-light/70 mt-3 text-sm leading-relaxed text-pretty md:text-base">
                        {tagline(key)}
                      </p>
                      <span className="text-gold mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium transition-colors group-hover:text-white">
                        {t("labels.explore")}
                        <ArrowRight
                          className="size-4 transition-transform duration-500 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}
