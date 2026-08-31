import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { EXPERTISE_AREAS } from "@/lib/expertise";
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

  return (
    <>
      <section className="bg-dark pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h1 className="font-display max-w-4xl text-[1.9rem] leading-[1.1] text-balance text-white sm:text-4xl md:text-5xl">
            {t("hero.heading")}
          </h1>
          <p className="text-grey-light/75 mt-8 max-w-3xl text-base leading-relaxed text-pretty md:text-lg">
            {t("hero.text")}
          </p>
        </div>
      </section>

      {/* Six blocks, each its own page. Numbered so the set reads as a
          structured offer rather than an unordered pile of services. */}
      <section className="bg-dark border-t border-white/5 pt-4 pb-20 md:pb-28 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-5 pt-14 md:grid-cols-2 md:gap-6 md:pt-16">
            {EXPERTISE_AREAS.map(({ key, slug }, i) => (
              <Reveal key={key} delay={i * 0.06} className="h-full">
                <Link
                  href={`/expertise/${slug}`}
                  className="group flex h-full flex-col rounded-[18px] border border-white/10 bg-white/3 p-7 transition-[border-color,background-color,translate] duration-500 hover:-translate-y-1 hover:border-gold/40 hover:bg-white/5 md:p-10"
                >
                  <span className="text-gold text-xs font-medium tracking-[0.2em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display mt-5 text-xl leading-snug text-balance text-white transition-colors group-hover:text-gold md:text-2xl">
                    {t(`areas.${key}.title` as "areas.crisis.title")}
                  </h2>
                  <p className="text-grey-light/70 mt-3 text-sm leading-relaxed text-pretty md:text-base">
                    {t(`areas.${key}.tagline` as "areas.crisis.tagline")}
                  </p>
                  <span className="text-gold mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium transition-colors group-hover:text-white">
                    {t("labels.explore")}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCtaSection />
    </>
  );
}
